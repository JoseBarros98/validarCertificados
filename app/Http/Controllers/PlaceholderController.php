<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PlaceholderController extends Controller
{
    public function generatePlaceholder(Request $request)
    {
        $width = $request->query('width', 300);
        $height = $request->query('height', 150);
        $bgColor = $request->query('bg', 'CCCCCC');
        $textColor = $request->query('text', '666666');
        
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' . $width . '" height="' . $height . '" viewBox="0 0 ' . $width . ' ' . $height . '">';
        $svg .= '<rect width="100%" height="100%" fill="#' . $bgColor . '"/>';
        $svg .= '<text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#' . $textColor . '" text-anchor="middle" dominant-baseline="middle">' . $width . ' x ' . $height . '</text>';
        $svg .= '</svg>';
        
        return response($svg)->header('Content-Type', 'image/svg+xml');
    }
}