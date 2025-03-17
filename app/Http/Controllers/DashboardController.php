<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Obtener estadísticas de certificados
        $totalCertificates = Certificate::count();
        $validCertificates = Certificate::where('status', 'valid')->count();
        $invalidCertificates = Certificate::where('status', 'invalid')->count();

        // Obtener actividad reciente (últimas modificaciones a certificados)
        $recentActivity = Certificate::select('id', 'code', 'student_name', 'status', 'updated_at', 'created_at')
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($certificate) {
                return [
                    'id' => $certificate->id,
                    'action' => $this->determineAction($certificate),
                    'user' => 'Sistema', // Idealmente, esto debería venir de un registro de auditoría
                    'date' => $certificate->updated_at ? $certificate->updated_at->format('Y-m-d') : 'N/A',
                    'certificate' => $certificate->code,
                    'student_name' => $certificate->student_name
                ];
            });

        // Obtener distribución de certificados por mes (últimos 6 meses)
        $certificatesByMonth = $this->getCertificatesByMonth();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalCertificates' => $totalCertificates,
                'validCertificates' => $validCertificates,
                'invalidCertificates' => $invalidCertificates,
                'recentActivity' => $recentActivity,
                'certificatesByMonth' => $certificatesByMonth,
                'userCount' => User::count()
            ]
        ]);
    }

    /**
     * Determina la acción realizada en el certificado basado en su estado
     */
    private function determineAction($certificate)
    {
        // Verificar si los timestamps están disponibles
        if (!$certificate->created_at || !$certificate->updated_at) {
            return $certificate->status === 'valid' ? 'Certificado validado' : 'Certificado invalidado';
        }

        // Esta es una simplificación. En un sistema real, deberías tener un registro de auditoría
        if ($certificate->created_at->diffInMinutes($certificate->updated_at) < 10) {
            return 'Certificado creado';
        }

        return $certificate->status === 'valid' ? 'Certificado validado' : 'Certificado invalidado';
    }

    /**
     * Obtiene la distribución de certificados por mes (últimos 6 meses)
     */
    private function getCertificatesByMonth()
{
    
    \Carbon\Carbon::setLocale('es');

    $months = collect([]);

    // Obtener datos para los últimos 3 meses
    for ($i = 2; $i >= 0; $i--) {
        $date = now()->subMonths($i);
        $monthName = ucfirst($date->translatedFormat('F'));
        $year = $date->format('Y');
        $monthStart = $date->startOfMonth()->format('Y-m-d');
        $monthEnd = $date->endOfMonth()->format('Y-m-d');

        $validCount = Certificate::where('status', 'valid')
            ->whereNotNull('created_at')
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->count();

        $invalidCount = Certificate::where('status', 'invalid')
            ->whereNotNull('created_at')
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->count();

        $months->push([
            'month' => $monthName,
            'year' => $year,
            'valid' => $validCount,
            'invalid' => $invalidCount,
            'total' => $validCount + $invalidCount
        ]);
    }

    return $months;
}

}

