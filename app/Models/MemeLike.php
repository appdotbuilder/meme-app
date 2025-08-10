<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\MemeLike
 *
 * @property int $id
 * @property int $meme_id
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Meme $meme
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|MemeLike newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MemeLike newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MemeLike query()
 * @method static \Illuminate\Database\Eloquent\Builder|MemeLike whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MemeLike whereMemeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MemeLike whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MemeLike whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MemeLike whereUpdatedAt($value)
 * @method static \Database\Factories\MemeLikeFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class MemeLike extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'meme_id',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'meme_id' => 'integer',
        'user_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the meme that this like belongs to.
     */
    public function meme(): BelongsTo
    {
        return $this->belongsTo(Meme::class);
    }

    /**
     * Get the user who made the like.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}