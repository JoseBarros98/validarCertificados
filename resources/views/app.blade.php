<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', 'resources/css/app.css'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia<!DOCTYPE html>
        <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
        
              <title inertia>{{ config('app.name') }}</title>
        
              <!-- Favicon -->
              <link rel="icon" type="image/png" src="/imagenes/logo.png">
              <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">
        
              <!-- Fonts -->
              <link rel="preconnect" href="https://fonts.bunny.net">
              <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        
              <!-- Scripts -->
              @routes
              @viteReactRefresh
              @vite(['resources/js/app.jsx', 'resources/css/app.css'])
              @inertiaHead
          </head>
          <body class="font-sans antialiased">
              @inertia
          </body>
        </html>
        
        
    </body>
</html>

