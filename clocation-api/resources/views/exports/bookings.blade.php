<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport des Réservations</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #333;
            margin: 0;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .status {
            padding: 3px 8px;
            border-radius: 3px;
            color: white;
            font-size: 10px;
        }
        .status.confirmed { background-color: #28a745; }
        .status.pending { background-color: #ffc107; color: #000; }
        .status.cancelled { background-color: #dc3545; }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport des Réservations</h1>
        <p>Généré le {{ date('d/m/Y à H:i') }}</p>
        <p>Total: {{ count($bookings) }} réservation(s)</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Véhicule</th>
                <th>Date début</th>
                <th>Date fin</th>
                <th>Destination</th>
                <th>Objectif</th>
                <th>Statut</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bookings as $booking)
            <tr>
                <td>{{ $booking->id }}</td>
                <td>{{ $booking->user ? $booking->user->name : 'N/A' }}</td>
                <td>{{ $booking->vehicleType }} - {{ $booking->vehicleId }}</td>
                <td>{{ $booking->startDate }} {{ $booking->startTime }}</td>
                <td>{{ $booking->endDate }} {{ $booking->endTime }}</td>
                <td>{{ $booking->destination }}</td>
                <td>{{ $booking->purpose }}</td>
                <td>
                    <span class="status {{ strtolower($booking->status) }}">
                        {{ ucfirst($booking->status) }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Système de Gestion de Flotte - ClocationApp</p>
    </div>
</body>
</html>