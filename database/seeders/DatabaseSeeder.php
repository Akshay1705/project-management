<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Team;
use App\Models\Client;
use App\Models\Tag;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $admin = User::firstOrCreate(
            ['email' => 'akshay@pm.com'],
            [
                'name' => 'Akshay Parekh',
                'password' => Hash::make('password'),
            ]
        );

        $admin->assignRole('admin');

        $member = User::firstOrCreate(
            ['email' => 'member@pm.com'],
            [
                'name' => 'Test Member',
                'password' => Hash::make('password'),
            ]
        );

        $member->assignRole('member');

        // Teams
        foreach (
            [
                'Team One',
                'Team Two',
                'Team Three',
            ] as $team
        ) {
            Team::firstOrCreate([
                'name' => $team,
            ]);
        }

        // Clients
        foreach (
            [
                'Client One',
                'Client Two',
                'Client Three',
            ] as $client
        ) {
            Client::firstOrCreate([
                'name' => $client,
            ]);
        }

        // Tags
        foreach (
            [
                'Biology',
                'Brainlessness',
                'Jerry',
                'Neurology',
                'Not_the_mouse',
                'Rick',
            ] as $tag
        ) {
            Tag::firstOrCreate([
                'name' => $tag,
            ]);
        }
    }

}
