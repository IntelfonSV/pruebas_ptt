<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $productId = DB::table('products')->insertGetId([
            'name' => 'App PTT Android',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $versionId = DB::table('product_versions')->insertGetId([
            'product_id' => $productId,
            'version' => 'v1.0.0',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $testTypeIds = DB::table('test_types')->pluck('id')->toArray();
        DB::table('product_version_types')->insert(
            collect($testTypeIds)->map(fn($id) => [
                'product_version_id' => $versionId,
                'test_type_id' => $id,
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray()
        );
    }
}
