<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TestResult extends Model
{
    protected $fillable = ['test_session_id', 'test_id', 'result', 'notes'];

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    public function testSession(): BelongsTo
    {
        return $this->belongsTo(TestSession::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(TestResultAttachment::class);
    }
}
