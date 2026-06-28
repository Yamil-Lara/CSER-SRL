<?php

namespace App\Mail;

use App\Models\OfertaReclutador;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OfertaTrabajoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $oferta;

    /**
     * Create a new message instance.
     */
    public function __construct(OfertaReclutador $oferta)
    {
        $this->oferta = $oferta;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '¡Nueva Oferta de Trabajo de ' . $this->oferta->empresa . '!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.oferta-trabajo',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
