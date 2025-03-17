<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FaviconController extends Controller
{
    public function favicon()
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
        $svg .= '<path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="#f97316" stroke="#f97316"/>';
        $svg .= '<path d="M6 12v5c3 3 9 3 12 0v-5" fill="none" stroke="#f97316"/>';
        $svg .= '</svg>';
        
        return response($svg)->header('Content-Type', 'image/svg+xml');
    }

    public function appleTouchIcon()
    {
        $size = 180;
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="'.$size.'" height="'.$size.'" viewBox="0 0 '.$size.' '.$size.'">';
        $svg .= '<rect width="'.$size.'" height="'.$size.'" fill="#f97316" rx="40" ry="40"/>';
        $svg .= '<g transform="translate('.($size/6).', '.($size/6).') scale(4)">';
        $svg .= '<path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="#ffffff" stroke="#ffffff" stroke-width="0.5"/>';
        $svg .= '<path d="M6 12v5c3 3 9 3 12 0v-5" fill="none" stroke="#ffffff" stroke-width="0.5"/>';
        $svg .= '</g>';
        $svg .= '</svg>';
        
        return response($svg)->header('Content-Type', 'image/svg+xml');
    }
}

