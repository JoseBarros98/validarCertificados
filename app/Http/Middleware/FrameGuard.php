<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class FrameGuard
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Verificar si la ruta es para descargar un certificado
        if ($request->is('api/download-certificate/*') || $request->is('certificates/download/*')) {
            // Para rutas de descarga, no aplicamos la protección X-Frame-Options
            return $next($request);
        }
        
        // Para todas las demás rutas, aplicamos la protección X-Frame-Options
        $response = $next($request);
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        
        return $response;
    }
}

