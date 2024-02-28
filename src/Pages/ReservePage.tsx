import { Link, useLocation } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Login } from "../components/Login";
import { SignUp } from "../components/SignUp";
import { useEffect, useRef, useState } from "react";
import { auth } from "../Firebase";
import { BookingPreview } from "../components/BookingPreview";
import { Footer } from "../components/Footer";
import { getOneBooking } from "../services/getOneBooking";
import { Booking } from "../models/Booking.interface";
import { createBooking } from "../services/createBooking";
import { AvailabilityInput } from "../models/Availability.interface";
import PaypalButton from "../components/PaypalButton/PaypalButton";
import { useForm } from "react-hook-form";
import { updateBookingDates } from "../services/updateBookingDates";



export const ReservationForm = () => {
  const bookingForm = useForm({ mode: "onBlur" });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const checkInDate = queryParams.get("checkin")?.toString() ?? "";
  const checkOutDate = queryParams.get("checkout")?.toString() ?? "";
  const numAdults = queryParams.get("numAdults")?.toString() ?? "";
  const numBabies = queryParams.get("numBabies")?.toString() ?? "";
  const numChildren = queryParams.get("numChildren")?.toString() ?? "";
  const childAges = queryParams.get("childAges")?.toString() ?? "";
  const childAgesArray = childAges.split(',');
  const isServiceAnimal = queryParams.get("isServiceAnimal")?.toString() ?? "";

  console.log("id", id);
  console.log("checkInDate", checkInDate);
  console.log("checkOutDate", checkOutDate);
  console.log("numAdults", numAdults);
  console.log("numBabies", numBabies);
  console.log("numChildren", numChildren);
  console.log("childAgesArray", childAgesArray);
  console.log("isServiceAnimal", isServiceAnimal);

  const isLoggedIn = !!auth.currentUser;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [signUpFailed, setSignUpFailed] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [bookingDetails, setBookingDetails] = useState<Booking | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const bookingDetails = getOneBooking(id);
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
  }, [id]);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginFailed(false);
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
    setSignUpFailed(false);
  };

  const openSuccessModal = () => {
    setIsSuccessModalOpen(true);
  };

  const handleClickOutsideModal = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeLoginModal();
      closeSignUpModal();
    }
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  async function create_booking() {
    const arrivalDate =
      (document.getElementById("llegada") as HTMLInputElement)?.value ?? "";
    const departureDate =
      (document.getElementById("salida") as HTMLInputElement)?.value ??
      checkOutDate;
    const availability: AvailabilityInput = {
      booking_id: id ?? "",
      start_date: arrivalDate,
      end_date: departureDate,
      user: auth.currentUser?.uid ?? "",
    };
    const res = await createBooking(availability);

    if (res.status === 200) {
      console.log("Booking create successfully");
    } else {
      console.error("Error creating booking");
    }
  }

  async function update_booking_dates() {
    const bookingToUpdate: Booking = {
      ...bookingDetails,
      availability: [
        ...(bookingDetails.availability || []),
        (document.getElementById("llegada") as HTMLInputElement)?.value ?? "",
        (document.getElementById("salida") as HTMLInputElement)?.value ?? "",
      ],
    };

    const res = await updateBookingDates(id ?? "", bookingToUpdate);
    if (res.status === 200) {
      console.log("Booking updated successfully");
    } else {
      console.error("Error updating booking");
    }
  }

  const handleCreateBooking = () => {
    if (isLoggedIn) {
      update_booking_dates();
      create_booking();
      openSuccessModal();
    } else {
      openLoginModal();
    }
  };
  async function update_booking_dates() {
    if (bookingDetails) {
      const bookingToUpdate: Booking = {
        ...(bookingDetails || {}),
        availability: [
          ...(bookingDetails.availability || []),
          (document.getElementById("llegada") as HTMLInputElement)?.value ?? "",
          (document.getElementById("salida") as HTMLInputElement)?.value ?? "",
        ],
      };

      const res = await updateBookingDates(id ?? "", bookingToUpdate);
      if (res.status === 200) {
        console.log("Booking updated successfully");
      } else {
        console.error("Error updating booking");
      }
    }
  };

  


  return (
    <>
      <Link
        to={"/"}
        className="absolute flex flex-row text-white font-bold py-2 px-4 rounded-full mx-10 my-4 hover:bg-blue-400"
      >

        <ChevronLeftIcon className="h-5 w-5" />
        <p className="font-bold">Regresar</p>

      </Link>
      <div className="w-full">
        <br></br>
        <br></br>
        <br></br>
        <div className="h-full flex justify-center items-center">
          {/* BookingPreview */}
          {bookingDetails && (
            <BookingPreview
              _id={bookingDetails._id}
              name={bookingDetails.name}
              summary={bookingDetails.summary}
              description={bookingDetails.description}
              capacity={bookingDetails.capacity}
              price={bookingDetails.price}
              room_type={bookingDetails.room_type}
              bed_type={bookingDetails.bed_type}
              minimum_nights={bookingDetails.minimum_nights}
              maximum_nights={bookingDetails.maximum_nights}
              bedrooms={bookingDetails.bedrooms}
              beds={bookingDetails.beds}
              bathrooms={bookingDetails.bathrooms}
              images={bookingDetails.images}
              availability={bookingDetails.availability}
              reviews={bookingDetails.reviews}
            />
          )}
          <div className="ml-8">
            <div className="flex justify-center items-center">
              <h1 className="text-white text-4xl font-bold mt-10">
                Reserva tu estadía
              </h1>
            </div>
            <form className="flex flex-col items-center mt-2">
              <label htmlFor="llegada" className="text-white mt-6 mb-2">
                Llegada:
              </label>
              <input
                {...bookingForm.register("llegada", {
                  required: "Este campo es requerido.",
                  validate: () => {
                    if (bookingDetails?.availability) {
                      const bookings = bookingDetails.availability;
                      const arrivalDate = bookingForm.getValues("llegada");
                      const departureDate = bookingForm.getValues("salida");

                      const isBookingInRange = bookings.some(
                        (booking, index) => {
                          if (index % 2 === 0) {
                            const bookingStart = new Date(booking.toString());
                            const bookingEnd = new Date(
                              bookings[index + 1].toString()
                            );
                            const arrival = new Date(arrivalDate);
                            const departure = new Date(departureDate);

                            return (
                              (arrival >= bookingStart &&
                                arrival <= bookingEnd) ||
                              (departure >= bookingStart &&
                                departure <= bookingEnd)
                            );
                          }
                          return false;
                        }
                      );

                      if (isBookingInRange) {
                        return "Booking already exists in the selected date range.";
                      }
                    }
                    return "";
                  },
                })}

                type="date"
                id="llegada"
                name="llegada"
                className="ml-2 block w-40 px-6 py-2 rounded-md bg-blue-500 border border-blue-500 text-sm text-white"
                required
                defaultValue={checkInDate}
              />

              <label htmlFor="salida" className="text-white mt-6 mb-2">
                Salida:
              </label>
              <input
                type="date"
                id="salida"
                name="salida"
                className="ml-2 block w-40 px-6 py-2 rounded-md bg-blue-500 border border-blue-500 text-sm text-white"
                required
                defaultValue={checkOutDate}
              />
              {bookingDetails && (
                <>
                  <label htmlFor="huéspedes" className="text-white mt-6 mb-2">
                    Huéspedes:
                  </label>
                  <select
                    id="huéspedes"
                    name="huéspedes"
                    className="ml-2 block w-40 px-6 py-2 rounded-md bg-blue-500 border border-blue-500 text-sm text-white"
                    required
                  >
                    {/* Generar opciones dinámicamente según la disponibilidad */}
                    {[...Array(bookingDetails.capacity).keys()].map((index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1} huésped{index !== 0 && "es"}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </form>

            {isLoggedIn ? (
              <div className="flex justify-center items-center mt-10">
                <br></br>
                <script src="https://www.paypal.com/sdk/js?client-id=AY2f43SwdopSTs-DomykC8YVjiONxiabKoYQqEzrlFZRSriocLQqEUKjXVAas2FyK0iqhhXnJOXhE8Oo&currency=USD"></script>
                  <button onClick={handleCreateBooking}>
                    <PaypalButton total_price={bookingDetails.price} />
                  </button>
              </div>
            ) : (
              <div className="mt-8">
                <div className="flex justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={openSignUpModal} // Open SignUp modal on click
                  >
                    Sign Up
                  </button>
                </div>
                <p className="text-center text-white mt-4">
                  Already have an account?{" "}
                  <button onClick={openLoginModal} className="text-blue-500">
                    Log in
                  </button>
                  {isLoginModalOpen && (
                    <div className="bg-black fixed inset-0 flex items-center justify-center z-50 bg-opacity-55">
                      <div className=" p-4 rounded-md" ref={modalRef}>
                        {loginFailed ? (
                          <p className="text-white bg-red-500 p-2 rounded-md animate-pulse">
                            Login failed. Please try again.
                          </p>
                        ) : (
                          <Login
                            onSuccess={closeLoginModal}
                            onFailure={() => setLoginFailed(true)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {isSignUpModalOpen && (
                    <div className="bg-black fixed inset-0 flex items-center justify-center z-50 bg-opacity-55">
                      <div className=" p-4 rounded-md" ref={modalRef}>
                        {signUpFailed ? (
                          <p className="text-white bg-red-500 p-2 rounded-md animate-pulse">
                            Sign up failed. Please try again.
                          </p>
                        ) : (
                          <SignUp
                            onSuccess={closeSignUpModal}
                            onFailure={() => setSignUpFailed(true)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </p>
              </div>

            )}
          </div>
        </div>
      </div>
      {
        isSuccessModalOpen && (
          <>
            <div className="bg-black fixed inset-0 flex items-center justify-center z-50 bg-opacity-55">
              <div className="bg-green-600 p-4 rounded-md flex flex-col items-center justify-center animate-jump-in">
                <p className="text-white font-extrabold text-2xl">
                  Reserva realizada con éxito
                </p>
                <br />
                <Link to={"/"}>
                  <button
                    className="text-white font-bold py-2 px-4 rounded"
                    onClick={() => setIsSuccessModalOpen(false)}
                  >
                    Volver
                  </button>
                </Link>
              </div>
            </div>
          </>
        )
      }
      <br />
      <br />
      <Footer />
    </>
  );
};

export default ReservationForm;