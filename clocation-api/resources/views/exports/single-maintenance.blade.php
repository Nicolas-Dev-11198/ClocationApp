<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Fiche de Maintenance - {{ $maintenance->id }}</title>
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
        .status.scheduled { background-color: #17a2b8; }
        .status.in_progress { background-color: #ffc107; color: #333; }
        .status.cancelled { background-color: #dc3545; }
        .priority {
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 10px;
        }
        .priority.high { background-color: #dc3545; color: white; }
        .priority.medium { background-color: #ffc107; color: #333; }
        .priority.low { background-color: #28a745; color: white; }
        .validation-section {
            background-color: #f8f9fa;
            border-left: 4px solid #007bff;
        }
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
        <h1>Fiche de Maintenance</h1>
        <p>Généré le {{ date('d/m/Y à H:i') }}</p>
    </div>

    <div class="info-section">
        <h3>Informations Générales</h3>
        <div class="info-row">
            <div class="info-label">ID:</div>
            <div class="info-value">{{ $maintenance->id }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Type:</div>
            <div class="info-value">
                @switch($maintenance->type)
                    @case('preventive')
                        Préventive
                        @break
                    @case('corrective')
                        Corrective
                        @break
                    @case('emergency')
                        Urgence
                        @break
                    @default
                        {{ $maintenance->type }}
                @endswitch
            </div>
        </div>
        <div class="info-row">
            <div class="info-label">Pirogue:</div>
            <div class="info-value">{{ $maintenance->vehicleId }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Lieu:</div>
            <div class="info-value">{{ $maintenance->location ?? 'N/A' }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Date prévue:</div>
            <div class="info-value">{{ \Carbon\Carbon::parse($maintenance->scheduledDate)->format('d/m/Y') }}</div>
        </div>
        @if($maintenance->completedDate)
        <div class="info-row">
            <div class="info-label">Date réalisée:</div>
            <div class="info-value">{{ \Carbon\Carbon::parse($maintenance->completedDate)->format('d/m/Y') }}</div>
        </div>
        @endif
        <div class="info-row">
            <div class="info-label">Statut:</div>
            <div class="info-value">
                <span class="status {{ $maintenance->status }}">
                    @switch($maintenance->status)
                        @case('completed')
                            Terminée
                            @break
                        @case('scheduled')
                            Programmée
                            @break
                        @case('in_progress')
                            En cours
                            @break
                        @case('cancelled')
                            Annulée
                            @break
                        @default
                            {{ $maintenance->status }}
                    @endswitch
                </span>
            </div>
        </div>
        @if($maintenance->priority)
        <div class="info-row">
            <div class="info-label">Priorité:</div>
            <div class="info-value">
                <span class="priority {{ $maintenance->priority }}">
                    @switch($maintenance->priority)
                        @case('high')
                            Haute
                            @break
                        @case('medium')
                            Moyenne
                            @break
                        @case('low')
                            Basse
                            @break
                        @default
                            {{ $maintenance->priority }}
                    @endswitch
                </span>
            </div>
        </div>
        @endif
        <div class="info-row">
            <div class="info-label">Technicien:</div>
            <div class="info-value">{{ $maintenance->user->name ?? 'N/A' }}</div>
        </div>
    </div>

    @if($maintenance->description)
    <div class="info-section">
        <h3>Description</h3>
        <div class="info-value">{{ $maintenance->description }}</div>
    </div>
    @endif

    @if($maintenance->workPerformed)
    <div class="info-section">
        <h3>Travaux Effectués</h3>
        <div class="info-value">{{ $maintenance->workPerformed }}</div>
    </div>
    @endif

    @if($maintenance->partsUsed)
    <div class="info-section">
        <h3>Pièces Utilisées</h3>
        <div class="info-value">{{ $maintenance->partsUsed }}</div>
    </div>
    @endif

    @if($maintenance->cost)
    <div class="info-section">
        <h3>Coût</h3>
        <div class="info-row">
            <div class="info-label">Montant:</div>
            <div class="info-value">{{ number_format($maintenance->cost, 0, ',', ' ') }} FCFA</div>
        </div>
    </div>
    @endif

    @if($maintenance->pilotValidated || $maintenance->hseValidated)
    <div class="info-section validation-section">
        <h3>Validations</h3>
        @if($maintenance->pilotValidated)
        <div class="info-row">
            <div class="info-label">Validation Pilote:</div>
            <div class="info-value">✓ Validé</div>
        </div>
        @endif
        @if($maintenance->hseValidated)
        <div class="info-row">
            <div class="info-label">Validation HSE:</div>
            <div class="info-value">✓ Validé</div>
        </div>
        @endif
    </div>
    @endif

    @if($maintenance->notes)
    <div class="info-section">
        <h3>Notes</h3>
        <div class="info-value">{{ $maintenance->notes }}</div>
    </div>
    @endif

    <div class="footer">
        <p>Document généré automatiquement par le système de gestion de flotte</p>
    </div>
</body>
</html>