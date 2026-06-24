<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Team;
use App\Models\Client;
use App\Models\Tag;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Teams
        Team::insert([
            ['name' => 'Team One', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Team Two', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Team Three', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Clients
        Client::insert([
            ['name' => 'Client One', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Client Two', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Client Three', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Tags
        Tag::insert([
            ['name' => 'Biology', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Brainlessness', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Jerry', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Neurology', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Not_the_mouse', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Rick', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

}
