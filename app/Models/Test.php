<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Test extends Model
{
    protected $fillable = ['test_type_id', 'name', 'description', 'expected_result'];

    public function testType(): BelongsTo
    {
        return $this->belongsTo(TestType::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(TestResult::class);
    }
}
