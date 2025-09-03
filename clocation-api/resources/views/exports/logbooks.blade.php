<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport des Carnets de Bord</title>
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
        .status.completed { background-color: #28a745; }
        .status.in_progress { background-color: #17a2b8; }
        .status.pending { background-color: #ffc107; color: #000; }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .km-info {
            font-weight: bold;
            color: #007bff;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport des Carnets de Bord</h1>
        <p>Généré le {{ date('d/m/Y à H:i') }}</p>
        <p>Total: {{ count($logbooks) }} entrée(s)</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Véhicule</th>
                <th>Date</th>
                <th>Départ</th>
                <th>Arrivée</th>
                <th>Km</th>
                <th>Destination</th>
                <th>Observations</th>
                <th>Statut</th>
            </tr>
        </thead>
        <tbody>
            @foreach($logbooks as $logbook)
            <tr>
                <td>{{ $logbook->id }}</td>
                <td>{{ $logbook->user ? $logbook->user->name : 'N/A' }}</td>
                <td>{{ $logbook->vehicleId }}</td>
                <td>{{ $logbook->date }}</td>
                <td>{{ $logbook->departureTime }}</td>
                <td>{{ $logbook->arrivalTime }}</td>
                <td class="km-info">
                    {{ $logbook->startKm }} - {{ $logbook->endKm }}
                    @if($logbook->endKm && $logbook->startKm)
                        <br><small>({{ $logbook->endKm - $logbook->startKm }} km)</small>
                    @endif
                </td>
                <td>{{ $logbook->destination }}</td>
                <td>{{ Str::limit($logbook->observations, 50) }}</td>
                <td>
                    <span class="status {{ strtolower($logbook->status) }}">
                        {{ ucfirst($logbook->status) }}
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