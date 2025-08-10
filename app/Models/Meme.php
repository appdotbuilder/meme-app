<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Meme
 *
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property string $image_path
 * @property int $user_id
 * @property int $likes_count
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read bool|null $is_liked
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MemeComment> $comments
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MemeLike> $likes
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Meme newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Meme newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Meme query()
 * @method static \Illuminate\Database\Eloquent\Builder|Meme whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Meme whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Meme whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Meme whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Meme whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Meme whereLikesCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Meme whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Meme whereUpdatedAt($value)
 * @method static \Database\Factories\MemeFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Meme extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'image_path',
        'user_id',
        'likes_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'likes_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the meme.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the comments for the meme.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(MemeComment::class);
    }

    /**
     * Get the likes for the meme.
     */
    public function likes(): HasMany
    {
        return $this->hasMany(MemeLike::class);
    }
}