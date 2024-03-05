import { Booking } from "../models/Booking.interface";
import {
  Availability,
  AvailabilityInput,
} from "../models/Availability.interface";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { updateAvailability } from "../services/updateAvailability";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAvailability } from "../services/deleteAvailability";
import { getOneBooking } from "../services/getOneBooking";
import DatePicker from "react-datepicker";
import { updateBookingDates } from "../services/updateBookingDates";

interface HistoryCardProps {
  booking: Booking;
  availability: Availability;
}

const today = new Date();
today.setDate(today.getDate() + 1);

export const HistoryCard: React.FC<HistoryCardProps> = ({
  booking,
  availability,
}) => {
  const id = availability._id;
  const [bookingDetails, setBookingDetails] = useState<Booking>({} as Booking);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalopen] = useState(false);
  const updateModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const startDate = new Date(availability.start_date);
  const endDate = new Date(availability.end_date);
  

  const dateRange = endDate.getTime() - startDate.getTime();
  const days = dateRange / (1000 * 60 * 60 * 24);

  const total = days * booking.price;

  const [checkInDate, setCheckInDate] = useState(availability.start_date);
  const [checkOutDate, setCheckOutDate] = useState(availability.end_date);

  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(
    checkInDate ? new Date(checkInDate) : new Date()
  );
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    checkOutDate ? new Date(checkOutDate) : new Date()
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (availability.booking_id) {
          const bookingDetails = getOneBooking(availability.booking_id);
          setBookingDetails(await bookingDetails);
          console.log(bookingDetails);
        } else {
          console.log("Invalid id");
        }
      } catch (error) {
        console.log("Error fetching booking details", error);
      }
    };
    fetchData();
  }, [availability.booking_id]);

  async function update_booking_dates() {
    if (bookingDetails && bookingDetails.availability) {
      const updatedAvailability = bookingDetails.availability.filter(
        (avail: string) => {
          return !(
            avail === availability.start_date || avail === availability.end_date
          );
        }
      );
      updatedAvailability.push(checkInDate, checkOutDate);

      const bookingToUpdate: Booking = {
        ...bookingDetails,
        availability: updatedAvailability,
      };

      const res = await updateBookingDates(availability.booking_id ?? "", bookingToUpdate);
      if (res.status === 200) {
        console.log("Booking updated successfully");
      } else {
        console.error("Error updating booking");
      }
    }
  };
  const restrictedDates = bookingDetails.availability;
  const dateRanges: Date[][] = [];
  const flattenedDateRanges = dateRanges.flat();
  const useRestrictedDates = flattenedDateRanges.map((date) => date.toString());
  const isDateSelectableArrival = (date: Date) =>
    !(useRestrictedDates ?? []).some(
      (restrictedDate) =>
        new Date(date).getDate() === new Date(restrictedDate).getDate() &&
        new Date(date).getFullYear() ===
          new Date(restrictedDate).getFullYear() &&
        new Date(date).getMonth() === new Date(restrictedDate).getMonth()
    ) &&
    (departureDate === undefined || new Date(date) < departureDate) &&
    new Date(date) > today;

  const isDateSelectableDeparture = (date: Date) =>
    !(useRestrictedDates ?? []).some(
      (restrictedDate) =>
        new Date(date).getDate() === new Date(restrictedDate).getDate() &&
        new Date(date).getFullYear() ===
          new Date(restrictedDate).getFullYear() &&
        new Date(date).getMonth() === new Date(restrictedDate).getMonth()
    ) &&
    (arrivalDate === undefined || new Date(date) > arrivalDate) &&
    new Date(date) > today;


  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalopen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalopen(false);
  };

  async function update_availability() {
    try {
      // Verificar si las fechas de llegada y salida son válidas
      if (!checkInDate || !checkOutDate) {
        console.log("Fechas de llegada o salida no válidas");
        return;
      }
  
      // Verificar si las fechas seleccionadas están disponibles
      const isArrivalAvailable = isDateSelectableArrival(arrivalDate || new Date());
      const isDepartureAvailable = isDateSelectableDeparture(departureDate || new Date());
  
      if (!isArrivalAvailable || !isDepartureAvailable) {
        console.log("Fechas no disponibles");
        return;
      }
  
      // Dividir la fecha y la hora y luego unirlas nuevamente
      const arrivalISODate = arrivalDate?.toISOString().split("T")[0] ?? "";
      const departureISODate = departureDate?.toISOString().split("T")[0] ?? "";
  
      const newAvailability: AvailabilityInput = {
        booking_id: availability.booking_id,
        start_date: arrivalISODate || "",
        end_date: departureISODate || "",
        user: availability.user,
      };
  
      const res = await updateAvailability(id, newAvailability);
  
      if (res.status === 200) {
        closeUpdateModal();
        console.log("Availability updated");
      } else {
        console.log("Error updating availability");
      }
    } catch (error) {
      console.error("Error updating availability", error);
    }
  }
  
  
  const updateAvailabilityAndBookingDates = async () => {
    try {
      if (!bookingDetails.availability) return;
      const updatedAvailability = bookingDetails.availability
        .filter((date: string) => date !== availability.start_date && date !== availability.end_date)
        .concat(arrivalDate ? [arrivalDate.toISOString()] : [], departureDate ? [departureDate.toISOString()] : []);

      const updatedBooking: Booking = {
        ...bookingDetails,
        availability: updatedAvailability,
      };

      const updateBookingRes = await updateBookingDates(availability.booking_id || "", updatedBooking);
      if (updateBookingRes.status === 200) {
        const updatedAvailabilityInput: AvailabilityInput = {
          booking_id: availability.booking_id,
          start_date: arrivalDate?.toISOString() || "",
          end_date: departureDate?.toISOString() || "",
          user: availability.user,
        };
        const updateAvailabilityRes = await updateAvailability(availability._id, updatedAvailabilityInput);
        if (updateAvailabilityRes.status === 200) {
          console.log("Availability and booking dates updated successfully");
          setIsUpdateModalOpen(false);
        } else {
          console.error("Error updating availability");
        }
      } else {
        console.error("Error updating booking dates");
      }
    } catch (error) {
      console.error("Error updating availability and booking dates", error);
    }
  };
  const handleUpdatingAvailability = async () => {
    if (!arrivalDate || !departureDate) return;
  
    try {
      // Ajustar las fechas al formato ISOString para enviarlas al servidor
      const arrivalISOString = arrivalDate.toISOString();
      const departureISOString = departureDate.toISOString();
  
      // Actualizar la disponibilidad y las fechas de reserva en el servidor
      const updatedAvailabilityInput: AvailabilityInput = {
        booking_id: availability.booking_id,
        start_date: arrivalISOString,
        end_date: departureISOString,
        user: availability.user,
      };
  
      const res = await updateAvailability(id, updatedAvailabilityInput);
  
      if (res.status === 200) {
        console.log("Availability updated");
        setIsUpdateModalOpen(false); // Cerrar el modal de actualización
      } else {
        console.error("Error updating availability");
      }
    } catch (error) {
      console.error("Error updating availability and booking dates", error);
    }
  };
  

  async function update_booking_dates_delete() {
    if (bookingDetails && bookingDetails.availability) {
      const updatedAvailability = bookingDetails.availability.filter(
        (avail: string) => {
          return !(avail === availability.start_date || avail === availability.end_date);
        }
      );

      const bookingToUpdate: Booking = {
        ...bookingDetails,
        availability: updatedAvailability,
      };

      const res = await updateBookingDates(availability.booking_id ?? "", bookingToUpdate);
      if (res.status === 200) {
        console.log("Booking updated successfully");
      } else {
        console.error("Error updating booking");
      }
    }
  };

  async function delete_availability() {
  try {
    const res = await deleteAvailability(id);

    if (res.status === 200) {
      closeDeleteModal();
      console.log("Availability deleted");
    } else {
      console.log("Error deleting availability");
    }
  } catch (error) {
    console.error("Error deleting availability", error);
  }
}

  const handleDeleteAvailability = () => {
    update_booking_dates_delete();
    delete_availability();
  };

  const handleClickOutsideModal = (event: MouseEvent) => {
    if (
      (updateModalRef.current &&
        !updateModalRef.current.contains(event.target as Node)) ||
      (deleteModalRef.current &&
        !deleteModalRef.current.contains(event.target as Node))
    ) {
      closeUpdateModal();
      closeDeleteModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  return (
    <>
      <div
        className={`bg-gray-900 rounded-lg shadow-lg p-4 w-11/12 animate-fade-up`}
      >
        <div className="flex justify-end">
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-400 hover:bg-blue-600 text-white mr-2"
            onClick={openUpdateModal}
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-400 hover:bg-red-600 text-white"
            onClick={openDeleteModal}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center">
          <img
            src={booking.images[0]}
            alt={booking.name}
            className="w-full h-60 object-cover mb-4 rounded-lg"
          />
        </div>
        <h2 className="text-white text-4xl font-bold mb-2">{booking.name}</h2>
        {/* <p className="text-blue-400 mb-2">{booking.description}</p> */}
        <p className="text-blue-400 mb-2">Precio: ${booking.price} /noche</p>
        <p className="text-blue-400 mb-2">Precio Total: ${total}</p>
        <p className="text-blue-400 mb-2">Capacidad: {booking.capacity}</p>
        <p className="text-blue-400 mb-2">Camas: {booking.beds}</p>
        <p className="text-blue-400 mb-2">Baños: {booking.bathrooms}</p>
        <div className="flex items-center justify-center">
          <p className="text-blue-400 mb-2">
            {availability.start_date} | {availability.end_date}
          </p>
        </div>
      </div>
      {isUpdateModalOpen && (
        <div className="bg-black fixed inset-0 flex items-center justify-center z-50 bg-opacity-55">
          <div
            className="bg-gray-900 p-4 rounded-md animate-jump-in"
            ref={updateModalRef}
          >
            <form
              // onSubmit={handleSubmitUpdate}
              className="flex flex-wrap justify-center gap-5"
            >
              <div className="flex items-center">
                <label htmlFor="llegada" className="text-white  mt-6 mb-2">
                  Llegada:
                </label>
                <DatePicker
                  id="llegada"
                  name="llegada"
                  required
                  className="ml-2 block w-40 px-6 py-2 rounded-md bg-blue-500 border border-blue-500 text-sm text-white"
                  selected={arrivalDate}
                  onChange={(date) => setArrivalDate(date || undefined)}
                  filterDate={(date) =>
                    isDateSelectableArrival(date || new Date())
                  }
                />

                <DatePicker
                  id="salida"
                  name="salida"
                  required
                  className="ml-2 block w-40 px-6 py-2 rounded-md bg-blue-500 border border-blue-500 text-sm text-white"
                  selected={departureDate}
                  onChange={(date) => setDepartureDate(date || undefined)}
                  filterDate={(date) =>
                    isDateSelectableDeparture(date || new Date())
                  }
                />
              </div>
              <div className="flex bg-blue-500  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <Link to={"/"}>
                  <button onClick={handleUpdatingAvailability}>
                    <p>Aceptar</p>
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="bg-black fixed inset-0 flex items-center justify-center z-50 bg-opacity-55">
          <div className=" p-4 rounded-md" ref={deleteModalRef}>
            <div className="bg-gray-900 p-4 rounded-md animate-jump-in">
              <p className="text-white text-center">
                ¿Estás seguro de que quieres eliminar esta reserva?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <div className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  <button onClick={closeDeleteModal}>
                    <p>Cancelar</p>
                  </button>
                </div>
                <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  <Link to={"/"}>
                    <button onClick={handleDeleteAvailability}>
                      <p>Eliminar</p>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
