<?php

namespace App\Models;

use Database\Factories\FocusAreaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FocusArea extends Model
{
    /** @use HasFactory<FocusAreaFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'icon',
        'title',
        'text',
        'sort_order',
    ];
}
