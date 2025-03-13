<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'student_name',
        'course_name',
        'issue_date',
        'status',
        'certificate_image',
    ];
}
