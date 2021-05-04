<?php
declare(strict_types=1);
namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;


class User implements Authenticatable
{

    protected $id;

    protected $nome;

    protected $email;

    protected $token;

    protected $roles;

    public function __construct(string $id, string $name, string $email, string $token, array $roles)
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->token = $token;
        $this->roles = $roles;
    }


    public function getAuthIdentifierName()
    {
        return $this->email;
    }

    public function getAuthIdentifier()
    {
        return $this->id;
    }

    public function getAuthPassword()
    {
        throw new \Exception(('Not implement'));
    }

    public function getRememberToken()
    {
        throw new \Exception(('Not implement'));
    }

    public function setRememberToken($value)
    {
        throw new \Exception(('Not implement'));
    }

    public function getRememberTokenName()
    {
        throw new \Exception(('Not implement'));
    }

    public function getRoles()
    {
        return $this->roles;
    }

    public function hasRole($role){
        return in_array($role,$this->roles);
    }
}
