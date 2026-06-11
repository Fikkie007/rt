<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int|null $id_data
 * @property string|null $tipe
 * @property string|null $nama
 * @property string|null $status_penghuni
 * @property string|null $status_bayar
 * @property float|null $bayar
 * @property string|null $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read int $jumlah_penghuni
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tran> $penghuni
 * @property-read int|null $penghuni_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data whereBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data whereIdData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data whereStatusBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data whereStatusPenghuni($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data whereTipe($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Data whereUpdatedAt($value)
 */
	class Data extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tran newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tran newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tran query()
 */
	class Tran extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

