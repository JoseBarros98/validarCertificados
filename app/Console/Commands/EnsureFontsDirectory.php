<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class EnsureFontsDirectory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fonts:ensure';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ensure the fonts directory exists and contains the required fonts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Ensure the fonts directory exists
        $fontsDir = public_path('fonts');
        if (!File::exists($fontsDir)) {
            File::makeDirectory($fontsDir, 0755, true);
            $this->info('Created fonts directory: ' . $fontsDir);
        }

        // Check if Arial font exists
        $arialPath = $fontsDir . '/arial.ttf';
        if (!File::exists($arialPath)) {
            // If Arial doesn't exist, copy a system font or create a placeholder
            $systemFonts = [
                // Windows paths
                'C:/Windows/Fonts/arial.ttf',
                // Linux paths
                '/usr/share/fonts/truetype/msttcorefonts/Arial.ttf',
                '/usr/share/fonts/TTF/Arial.ttf',
                // Mac paths
                '/Library/Fonts/Arial.ttf',
                '/System/Library/Fonts/Arial.ttf'
            ];

            $fontFound = false;
            foreach ($systemFonts as $systemFont) {
                if (File::exists($systemFont)) {
                    File::copy($systemFont, $arialPath);
                    $this->info('Copied Arial font from: ' . $systemFont);
                    $fontFound = true;
                    break;
                }
            }

            if (!$fontFound) {
                // If no system font found, download a free alternative
                $this->info('Arial font not found on system. Using a fallback font...');
                
                // Use a fallback like DejaVu Sans which is often available
                $fallbackFonts = [
                    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
                    '/usr/share/fonts/TTF/DejaVuSans.ttf'
                ];
                
                $fallbackFound = false;
                foreach ($fallbackFonts as $fallbackFont) {
                    if (File::exists($fallbackFont)) {
                        File::copy($fallbackFont, $arialPath);
                        $this->info('Using fallback font: ' . $fallbackFont);
                        $fallbackFound = true;
                        break;
                    }
                }
                
                if (!$fallbackFound) {
                    $this->error('No suitable font found. Please manually add arial.ttf to the public/fonts directory.');
                }
            }
        } else {
            $this->info('Arial font already exists.');
        }

        return 0;
    }
}

