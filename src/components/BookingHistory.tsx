import React, { useState } from 'react';

interface Reservation {
    id: number;
    roomName: string;
    checkInDate: string;
    checkOutDate: string;
    status: string;
}

const BookingHistory: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([
        {
            id: 1,
            roomName: 'Habitación 1',
            checkInDate: '2022-10-01',
            checkOutDate: '2022-10-05',
            status: 'confirmada',
        },
        {
            id: 2,
            roomName: 'Habitación 2',
            checkInDate: '2022-11-15',
            checkOutDate: '2022-11-20',
            status: 'pendiente',
        },
        {
            id: 3,
            roomName: 'Habitación 3',
            checkInDate: '2022-12-10',
            checkOutDate: '2022-12-15',
            status: 'cancelada',
        },
    ]);

    const handleModifyReservation = (reservationId: number) => {
        // Lógica para modificar la reserva
    };

    const handleCancelReservation = (reservationId: number) => {
        // Lógica para cancelar la reserva
    };

    return (
        <>
            <div className="container mx-auto bg-white">
                <h1 className="text-2xl font-bold mb-4 text-blue-500">Historial de Reservaciones</h1>
                {reservations.length === 0 ? (
                        <p>No hay reservas disponibles. Puedes realizar una nueva reserva en la página <a href="/">Home</a>.</p>
                    ) : (
                    <table className="table-auto w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Habitación</th>
                                <th className="px-4 py-2">Check-in</th>
                                <th className="px-4 py-2">Check-out</th>
                                <th className="px-4 py-2">Estado</th>
                                <th className="px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td className="border px-4 py-2">{reservation.roomName}</td>
                                    <td className="border px-4 py-2">{reservation.checkInDate}</td>
                                    <td className="border px-4 py-2">{reservation.checkOutDate}</td>
                                    <td className="border px-4 py-2">{reservation.status}</td>
                                    <td className="border px-4 py-2">
                                        {reservation.status === 'pendiente' && (
                                            <>
                                                <button onClick={() => handleModifyReservation(reservation.id)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Modificar</button>
                                                <button onClick={() => handleCancelReservation(reservation.id)} className="bg-red-500 text-white px-4 py-2 rounded">Cancelar</button>
                                            </>
                                        )}
                                        {reservation.status === 'confirmada' && (
                                            <button onClick={() => handleCancelReservation(reservation.id)} className="bg-red-500 text-white px-4 py-2 rounded">Cancelar</button>
                                        )}
                                        {reservation.status === 'cancelada' && (
                                            <p className="text-red-500">Esta reserva ha sido cancelada.</p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default BookingHistory;