<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TestResultAttachment extends Model
{
    protected $fillable = ['test_result_id', 'filename', 'original_name', 'mime_type', 'size'];

    public function testResult(): BelongsTo
    {
        return $this->belongsTo(TestResult::class);
    }
}