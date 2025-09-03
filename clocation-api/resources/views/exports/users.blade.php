<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport des Utilisateurs</title>
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
        .role {
            padding: 3px 8px;
            border-radius: 3px;
            color: white;
            font-size: 10px;
            font-weight: bold;
        }
        .role.admin { background-color: #dc3545; }
        .role.manager { background-color: #fd7e14; }
        .role.employee { background-color: #28a745; }
        .status {
            padding: 3px 8px;
            border-radius: 3px;
            color: white;
            font-size: 10px;
        }
        .status.active { background-color: #28a745; }
        .status.inactive { background-color: #6c757d; }
        .status.suspended { background-color: #dc3545; }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .department {
            font-style: italic;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport des Utilisateurs</h1>
        <p>Généré le {{ date('d/m/Y à H:i') }}</p>
        <p>Total: {{ count($users) }} utilisateur(s)</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Département</th>
                <th>Position</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Créé le</th>
                <th>Dernière connexion</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
            <tr>
                <td>{{ $user->id }}</td>
                <td>{{ $user->name }}</td>
                <td>{{ $user->email }}</td>
                <td>
                    <span class="role {{ strtolower($user->role) }}">
                        {{ ucfirst($user->role) }}
                    </span>
                </td>
                <td class="department">{{ $user->department ?: '-' }}</td>
                <td>{{ $user->position ?: '-' }}</td>
                <td>{{ $user->phone ?: '-' }}</td>
                <td>
                    <span class="status {{ strtolower($user->status) }}">
                        {{ ucfirst($user->status) }}
                    </span>
                </td>
                <td>{{ $user->created_at->format('d/m/Y') }}</td>
                <td>
                    @if($user->last_login)
                        {{ $user->last_login->format('d/m/Y H:i') }}
                    @else
                        Jamais
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    @if($users->count() > 0)
        <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <h3 style="margin-top: 0;">Statistiques</h3>
            @php
                $roleCounts = $users->groupBy('role')->map->count();
                $statusCounts = $users->groupBy('status')->map->count();
                $departmentCounts = $users->whereNotNull('department')->groupBy('department')->map->count();
            @endphp
            
            <div style="display: flex; justify-content: space-between;">
                <div style="flex: 1; margin-right: 20px;">
                    <p><strong>Par rôle:</strong></p>
                    <ul>
                        @foreach($roleCounts as $role => $count)
                            <li>{{ ucfirst($role) }}: {{ $count }}</li>
                        @endforeach
                    </ul>
                </div>
                
                <div style="flex: 1; margin-right: 20px;">
                    <p><strong>Par statut:</strong></p>
                    <ul>
                        @foreach($statusCounts as $status => $count)
                            <li>{{ ucfirst($status) }}: {{ $count }}</li>
                        @endforeach
                    </ul>
                </div>
                
                @if($departmentCounts->count() > 0)
                <div style="flex: 1;">
                    <p><strong>Par département:</strong></p>
                    <ul>
                        @foreach($departmentCounts as $department => $count)
                            <li>{{ $department }}: {{ $count }}</li>
                        @endforeach
                    </ul>
                </div>
                @endif
            </div>
        </div>
    @endif

    <div class="footer">
        <p>Système de Gestion de Flotte - ClocationApp</p>
    </div>
</body>
</html>