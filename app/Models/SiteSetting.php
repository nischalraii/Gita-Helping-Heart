<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'address',
        'address_short',
        'email',
        'phone',
        'map_embed_url',
        'facebook_url',
        'instagram_url',
        'youtube_url',
        'tiktok_url',
        'linkedin_url',
        'twitter_url',
        'whatsapp_url',
    ];

    /**
     * The single settings row, created with defaults on first access.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([], [
            'address' => 'Godawari Municipality-14, Thaiba, Lalitpur, Nepal',
            'address_short' => 'Godawari Municipality-14, Thaiba, Lalitpur',
            'email' => 'gita4gk@gmail.com',
        ]);
    }
}
