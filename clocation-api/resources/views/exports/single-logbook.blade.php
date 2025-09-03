<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Carnet de Bord - {{ $logbook->id }}</title>
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
        .info-section {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .info-section h3 {
            margin-top: 0;
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .info-row {
            display: flex;
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
            width: 150px;
            color: #555;
        }
        .info-value {
            flex: 1;
        }
        .status {
            padding: 3px 8px;
            border-radius: 3px;
            color: white;
            font-size: 10px;
        }
        .status.completed { background-color: #28a745; }
        .status.in_progress { background-color: #17a2b8; }
        .status.pending { background-color: #ffc107; color: #333; }
        .status.cancelled { background-color: #dc3545; }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Carnet de Bord</h1>
        <p>Généré le {{ date('d/m/Y à H:i') }}</p>
    </div>

    <div class="info-section">
        <h3>Informations Générales</h3>
        <div class="info-row">
            <div class="info-label">ID:</div>
            <div class="info-value">{{ $logbook->id }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Date:</div>
            <div class="info-value">{{ \Carbon\Carbon::parse($logbook->date)->format('d/m/Y') }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Pirogue:</div>
            <div class="info-value">{{ $logbook->vehicleId }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Pilote:</div>
            <div class="info-value">{{ $logbook->user->name ?? 'N/A' }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Statut:</div>
            <div class="info-value">
                <span class="status {{ $logbook->status }}">
                    @switch($logbook->status)
                        @case('completed')
                            Terminé
                            @break
                        @case('in_progress')
                            En cours
                            @break
                        @case('pending')
                            En attente
                            @break
                        @case('cancelled')
                            Annulé
                            @break
                        @default
                            {{ $logbook->status }}
                    @endswitch
                </span>
            </div>
        </div>
    </div>

    @if($logbook->booking)
    <div class="info-section">
        <h3>Réservation Associée</h3>
        <div class="info-row">
            <div class="info-label">ID Réservation:</div>
            <div class="info-value">{{ $logbook->booking->id }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Client:</div>
            <div class="info-value">{{ $logbook->booking->user->name ?? 'N/A' }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Période:</div>
            <div class="info-value">
                Du {{ \Carbon\Carbon::parse($logbook->booking->startDate)->format('d/m/Y') }}
                au {{ \Carbon\Carbon::parse($logbook->booking->endDate)->format('d/m/Y') }}
            </div>
        </div>
    </div>
    @endif

    @if($logbook->observations)
    <div class="info-section">
        <h3>Observations</h3>
        <div class="info-value">{{ $logbook->observations }}</div>
    </div>
    @endif

    @if($logbook->issues)
    <div class="info-section">
        <h3>Problèmes Signalés</h3>
        <div class="info-value">{{ $logbook->issues }}</div>
    </div>
    @endif

    <div class="footer">
        <p>Document généré automatiquement par le système de gestion de flotte</p>
    </div>
</body>
</html>