<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Login y Sesión'],
            ['name' => 'Grupos y Salas'],
            ['name' => 'PTT Half-Duplex'],
            ['name' => 'Audio'],
            ['name' => 'Botón Físico'],
            ['name' => 'Red'],
            ['name' => 'GPS Consola'],
            ['name' => 'PTT 1 a 1 Privado'],
            ['name' => 'Llamada 1 a 1'],
        ];

        DB::table('test_types')->insert($types);
    }
}
