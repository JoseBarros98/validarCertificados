<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Str;

class CertificateImageService
{
   /**
    * Añade un código QR y el código del certificado a la imagen
    *
    * @param string $imagePath Ruta de la imagen original
    * @param string $code Código del certificado
    * @return string Ruta de la nueva imagen
    */
   public function addQrCodeToImage($imagePath, $code)
   {
       // Verificar si la imagen existe
       if (!Storage::disk('public')->exists($imagePath)) {
           Log::error("Imagen original no encontrada: {$imagePath}");
           return null;
       }

       try {
           // Evitar procesar una imagen que ya tiene QR
           if (Str::contains($imagePath, '_with_qr')) {
               Log::info("La imagen ya tiene QR, usando la existente: {$imagePath}");
               return $imagePath;
           }

           // Generar la URL de validación
           $validationUrl = url('') . '?code=' . $code;
           
           // Generar el código QR
           $qrCode = new QrCode($validationUrl);
           $qrCode->setSize(200);
           $qrCode->setMargin(0);
           
           $writer = new PngWriter();
           $result = $writer->write($qrCode);
           
           // Guardar el QR temporalmente
           $qrImagePath = storage_path('app/temp_qr.png');
           file_put_contents($qrImagePath, $result->getString());
           
           // Cargar la imagen del certificado
           $certificateImagePath = Storage::disk('public')->path($imagePath);
           $certificateInfo = getimagesize($certificateImagePath);
           
           switch ($certificateInfo[2]) {
               case IMAGETYPE_JPEG:
                   $certificateImage = imagecreatefromjpeg($certificateImagePath);
                   break;
               case IMAGETYPE_PNG:
                   $certificateImage = imagecreatefrompng($certificateImagePath);
                   break;
               case IMAGETYPE_GIF:
                   $certificateImage = imagecreatefromgif($certificateImagePath);
                   break;
               default:
                   throw new \Exception('Formato de imagen no soportado');
           }
           
           // Preservar transparencia si es PNG
           if ($certificateInfo[2] == IMAGETYPE_PNG) {
               imagealphablending($certificateImage, true);
               imagesavealpha($certificateImage, true);
           }
           
           // Cargar la imagen del QR
           $qrImage = imagecreatefrompng($qrImagePath);
           
           // Obtener dimensiones
           $certificateWidth = imagesx($certificateImage);
           $certificateHeight = imagesy($certificateImage);
           $qrWidth = imagesx($qrImage);
           $qrHeight = imagesy($qrImage);
           
           // Redimensionar el QR si es necesario
           $qrSize = min(200, $certificateWidth * 0.15);
           $qrResized = imagecreatetruecolor($qrSize, $qrSize);
           
           // Preservar transparencia
           imagealphablending($qrResized, false);
           imagesavealpha($qrResized, true);
           $transparent = imagecolorallocatealpha($qrResized, 255, 255, 255, 127);
           imagefilledrectangle($qrResized, 0, 0, $qrSize, $qrSize, $transparent);
           
           // Redimensionar
           imagecopyresampled($qrResized, $qrImage, 0, 0, 0, 0, $qrSize, $qrSize, $qrWidth, $qrHeight);
           
           // Calcular posiciones
           $horizontalMargin = 170; // Margen horizontal reducido (antes era 240)
           $verticalMargin = 200;   // Mantener el mismo margen vertical
           $x = $horizontalMargin;
           $y = $certificateHeight - $qrSize - $verticalMargin;
           
           // Insertar el QR en la imagen del certificado
           imagecopy($certificateImage, $qrResized, $x, $y, 0, 0, $qrSize, $qrSize);
           
           // Añadir el texto "CODIGO DE VALIDACION:" debajo del QR
           $textColor = imagecolorallocate($certificateImage, 0, 0, 0);
           $fontSize = 5; // Tamaño de fuente GD (1-5)
           $fontWidth = imagefontwidth($fontSize);
           $fontHeight = imagefontheight($fontSize);
           
           // Primera línea: "Código de Validación:"
           $text1 = "Codigo de Validacion:";
           $text1Width = $fontWidth * strlen($text1);
           $text1X = $x + ($qrSize / 2) - ($text1Width / 2);
           $text1Y = $y + $qrSize + 10; // 10 píxeles debajo del QR
           
           // Segunda línea: el código del certificado
           $text2 = $code;
           $text2Width = $fontWidth * strlen($text2);
           $text2X = $x + ($qrSize / 2) - ($text2Width / 2);
           $text2Y = $text1Y + $fontHeight + 5; // 5 píxeles debajo de la primera línea
           
           // Dibujar ambas líneas de texto
           $this->drawText($certificateImage, $fontSize, $text1X, $text1Y, $text1, $textColor);
           $this->drawText($certificateImage, $fontSize, $text2X, $text2Y, $text2, $textColor);
           
           // Generar un nuevo nombre de archivo (evitando duplicar _with_qr)
           $baseName = pathinfo($imagePath, PATHINFO_FILENAME);
           $extension = pathinfo($imagePath, PATHINFO_EXTENSION);
           
           // Eliminar cualquier _with_qr existente
           $baseName = str_replace('_with_qr', '', $baseName);
           
           // Crear un nombre único para evitar colisiones
           $newImageName = $baseName . '_with_qr.' . $extension;
           $newImagePath = 'certificates/' . $newImageName;
           
           // Asegurarse de que la ruta no existe ya
           $counter = 1;
           while (Storage::disk('public')->exists($newImagePath)) {
               $newImageName = $baseName . '_with_qr_' . $counter . '.' . $extension;
               $newImagePath = 'certificates/' . $newImageName;
               $counter++;
               
               // Evitar bucles infinitos
               if ($counter > 10) {
                   $newImageName = $baseName . '_with_qr_' . time() . '.' . $extension;
                   $newImagePath = 'certificates/' . $newImageName;
                   break;
               }
           }
           
           $newImageFullPath = Storage::disk('public')->path($newImagePath);
           
           // Crear el directorio si no existe
           $directory = dirname($newImageFullPath);
           if (!file_exists($directory)) {
               mkdir($directory, 0755, true);
           }
           
           // Guardar la nueva imagen
           switch ($certificateInfo[2]) {
               case IMAGETYPE_JPEG:
                   imagejpeg($certificateImage, $newImageFullPath, 90);
                   break;
               case IMAGETYPE_PNG:
                   imagepng($certificateImage, $newImageFullPath, 9);
                   break;
               case IMAGETYPE_GIF:
                   imagegif($certificateImage, $newImageFullPath);
                   break;
           }
           
           // Liberar memoria
           imagedestroy($certificateImage);
           imagedestroy($qrImage);
           imagedestroy($qrResized);
           
           // Eliminar la imagen temporal del QR
           if (file_exists($qrImagePath)) {
               unlink($qrImagePath);
           }
           
           Log::info("Imagen con QR generada exitosamente: {$newImagePath}");
           return $newImagePath;
           
       } catch (\Exception $e) {
           // Registrar el error y devolver la ruta original
           Log::error('Error al procesar la imagen del certificado: ' . $e->getMessage());
           Log::error($e->getTraceAsString());
           return $imagePath;
       }
   }

   /**
    * Dibuja texto en una imagen con soporte para caracteres especiales
    * 
    * @param resource|GdImage $image Recurso de imagen GD
    * @param int $fontSize Tamaño de fuente
    * @param int $x Posición X
    * @param int $y Posición Y
    * @param string $text Texto a dibujar
    * @param int $color Color del texto
    */
   private function drawText($image, $fontSize, $x, $y, $text, $color): void
   {
       // Convertir caracteres especiales a sus equivalentes sin acentos
       $text = $this->removeAccents($text);
       
       // Dibujar el texto
       if ($image instanceof \GdImage) {
           imagestring($image, $fontSize, $x, $y, $text, $color);
       } else {
           throw new \InvalidArgumentException('Expected type GdImage for $image.');
       }
   }

   /**
    * Elimina acentos y caracteres especiales de un texto
    * 
    * @param string $text Texto con acentos
    * @return string Texto sin acentos
    */
   private function removeAccents($text)
   {
       $unwanted_array = array(
           'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
           'Á' => 'A', 'É' => 'E', 'Í' => 'I', 'Ó' => 'O', 'Ú' => 'U',
           'ñ' => 'n', 'Ñ' => 'N', 'ü' => 'u', 'Ü' => 'U'
       );
       return strtr($text, $unwanted_array);
   }
}

