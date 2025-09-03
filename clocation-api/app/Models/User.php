<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'firstName',
        'lastName',
        'role',
        'status',
        'department',
        'position',
        'hireDate',
        'salary',
        'phone',
        'address',
        'contractStart',
        'contractEnd',
        'medicalVisitStart',
        'medicalVisitEnd',
        'derogationStart',
        'derogationEnd',
        'inductionStart',
        'inductionEnd',
        'cnssNumber',
        'payrollNumber',
        'approved_by',
        'approved_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'hireDate' => 'date',
            'salary' => 'decimal:2',
            'contractStart' => 'date',
            'contractEnd' => 'date',
            'medicalVisitStart' => 'date',
            'medicalVisitEnd' => 'date',
            'derogationStart' => 'date',
            'derogationEnd' => 'date',
            'inductionStart' => 'date',
            'inductionEnd' => 'date',
            'approved_at' => 'datetime',
        ];
    }

    // Relations
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function logbooks()
    {
        return $this->hasMany(Logbook::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Helper methods
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }

    public function isRejected()
    {
        return $this->status === 'rejected';
    }

    public function isActive()
    {
        return $this->status === 'active' || $this->status === 'approved';
    }
}
