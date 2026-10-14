<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    public const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account Access', 'Email', 'Other'];
    public const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
    public const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

    protected $fillable = [
        'ticket_number', 'requester_name', 'requester_email', 'issue_category',
        'priority', 'subject', 'description', 'status',
    ];
}
