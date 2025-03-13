<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Certificate;

class CertificateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Certificate::create([
            'code' => 'CERT-2025-12345',
            'student_name' => 'Juan Pérez',
            'course_name' => 'Desarrollo web',
            'issue_date' => '2025-03-01',
            'status' => 'valid'
        ]);
        Certificate::create([
            'code' => 'CERT-2025-67890',
            'student_name' => 'Maria Garcia',
            'course_name' => 'Marketing Digital',
            'issue_date' => '2025-03-10',
            'status' => 'valid'
        ]);
        Certificate::create([
            'code' => 'CERT-2025-54321',
            'student_name' => 'Carlos López',
            'course_name' => 'Diseño Digital',
            'issue_date' => '2025-03-12',
            'status' => 'valid'
        ]);
    }
}
