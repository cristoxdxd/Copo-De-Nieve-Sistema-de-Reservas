import { useState, ChangeEvent, FormEvent, useCallback } from 'react';

export const BookingForm = () => {
    const [reservationData, setReservationData] = useState({
        name: '',
        email: '',
        checkInDate: '',
        checkOutDate: '',
    });

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReservationData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const handleReservationSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Datos de la reserva:', reservationData);
    }, [reservationData]);

    return (
        <>
            <form onSubmit={handleReservationSubmit} className="max-w-6x1 mx-auto bg-white p-8 rounded-md shadow-md my-8 mx-8 w-1/2">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={reservationData.name}
                        onChange={handleInputChange}
                        className="border rounded-md w-full py-2 px-3"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={reservationData.email}
                        onChange={handleInputChange}
                        className="border rounded-md w-full py-2 px-3"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="checkInDate" className="block text-gray-700 text-sm font-bold mb-2">
                        Fecha de Check-In
                    </label>
                    <input
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        value={reservationData.checkInDate}
                        onChange={handleInputChange}
                        className="border rounded-md w-full py-2 px-3"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="checkOutDate" className="block text-gray-700 text-sm font-bold mb-2">
                        Fecha de Check-Out
                    </label>
                    <input
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        value={reservationData.checkOutDate}
                        onChange={handleInputChange}
                        className="border rounded-md w-full py-2 px-3"
                        required
                    />
                </div>
                {/* Agrega más campos según sea necesario */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Reservar Ahora
                </button>
            </form>
        </>
    );
};
