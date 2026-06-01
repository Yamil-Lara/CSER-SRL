<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $resetUrl;

    public function __construct(User $user, string $resetUrl)
    {
        $this->user = $user;
        $this->resetUrl = $resetUrl;
    }

    public function build()
    {
        return $this->subject('Recuperación de contraseña - CSER S.R.L.')
            ->view('emails.reset-password')
            ->with([
                'userName' => $this->user->nombre,
                'resetUrl' => $this->resetUrl,
            ]);
    }
}
