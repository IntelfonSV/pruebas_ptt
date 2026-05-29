<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVersion extends Model
{
    protected $fillable = ['product_id', 'version'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function testTypes(): BelongsToMany
    {
        return $this->belongsToMany(TestType::class, 'product_version_types');
    }

    public function testSessions(): HasMany
    {
        return $this->hasMany(TestSession::class);
    }
}
