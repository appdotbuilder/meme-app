<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\MemeComment
 *
 * @property int $id
 * @property string $comment
 * @property int $meme_id
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Meme $meme
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|MemeComment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MemeComment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MemeComment query()
 * @method static \Illuminate\Database\Eloquent\Builder|MemeComment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MemeComment whereComment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MemeComment whereMemeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MemeComment whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MemeComment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MemeComment whereUpdatedAt($value)
 * @method static \Database\Factories\MemeCommentFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class MemeComment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'comment',
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
     * Get the meme that this comment belongs to.
     */
    public function meme(): BelongsTo
    {
        return $this->belongsTo(Meme::class);
    }

    /**
     * Get the user who made the comment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}