<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport des Maintenances</title>
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
        .status.scheduled { background-color: #17a2b8; }
        .status.in_progress { background-color: #ffc107; color: #000; }
        .status.cancelled { background-color: #dc3545; }
        .type {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        .type.preventive { background-color: #e3f2fd; color: #1976d2; }
        .type.corrective { background-color: #fff3e0; color: #f57c00; }
        .type.emergency { background-color: #ffebee; color: #d32f2f; }
        .cost {
            font-weight: bold;
            color: #28a745;
        }
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
        <h1>Rapport des Maintenances</h1>
        <p>Généré le {{ date('d/m/Y à H:i') }}</p>
        <p>Total: {{ count($maintenances) }} maintenance(s)</p>
        @php
            $totalCost = $maintenances->sum('cost');
        @endphp
        @if($totalCost > 0)
            <p>Coût total: <strong>{{ number_format($totalCost, 2) }} €</strong></p>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Véhicule</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date programmée</th>
                <th>Date réalisée</th>
                <th>Coût</th>
                <th>Statut</th>
            </tr>
        </thead>
        <tbody>
            @foreach($maintenances as $maintenance)
            <tr>
                <td>{{ $maintenance->id }}</td>
                <td>{{ $maintenance->user ? $maintenance->user->name : 'N/A' }}</td>
                <td>{{ $maintenance->vehicleId }}</td>
                <td>
                    <span class="type {{ strtolower($maintenance->type) }}">
                        {{ ucfirst($maintenance->type) }}
                    </span>
                </td>
                <td>{{ Str::limit($maintenance->description, 40) }}</td>
                <td>{{ $maintenance->scheduledDate }}</td>
                <td>{{ $maintenance->completedDate ?: '-' }}</td>
                <td class="cost">
                    @if($maintenance->cost)
                        {{ number_format($maintenance->cost, 2) }} €
                    @else
                        -
                    @endif
                </td>
                <td>
                    <span class="status {{ strtolower($maintenance->status) }}">
                        {{ ucfirst($maintenance->status) }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    @if($maintenances->count() > 0)
        <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <h3 style="margin-top: 0;">Statistiques</h3>
            @php
                $statusCounts = $maintenances->groupBy('status')->map->count();
                $typeCounts = $maintenances->groupBy('type')->map->count();
            @endphp
            <p><strong>Par statut:</strong></p>
            <ul>
                @foreach($statusCounts as $status => $count)
                    <li>{{ ucfirst($status) }}: {{ $count }}</li>
                @endforeach
            </ul>
            <p><strong>Par type:</strong></p>
            <ul>
                @foreach($typeCounts as $type => $count)
                    <li>{{ ucfirst($type) }}: {{ $count }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="footer">
        <p>Système de Gestion de Flotte - ClocationApp</p>
    </div>
</body>
</html>