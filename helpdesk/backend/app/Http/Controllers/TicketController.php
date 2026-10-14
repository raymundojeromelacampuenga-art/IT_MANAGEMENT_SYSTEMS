<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    private function rules(bool $isUpdate = false): array
    {
        return [
            'requester_name'  => 'required|string|max:255',
            'requester_email' => 'required|email|max:255',
            'issue_category'  => ['required', Rule::in(Ticket::CATEGORIES)],
            'priority'        => ['required', Rule::in(Ticket::PRIORITIES)],
            'subject'         => 'required|string|max:255',
            'description'     => 'required|string',
            'status'          => [$isUpdate ? 'required' : 'sometimes', Rule::in(Ticket::STATUSES)],
        ];
    }

    public function index()
    {
        return Ticket::orderByDesc('id')->get();
    }

    public function store(Request $request)
    {
        $ticket = Ticket::create($request->validate($this->rules()));
        $ticket->update(['ticket_number' => sprintf('TCK-%04d', $ticket->id)]);

        return response()->json($ticket->fresh(), 201);
    }

    public function show(Ticket $ticket)
    {
        return $ticket;
    }

    public function update(Request $request, Ticket $ticket)
    {
        $ticket->update($request->validate($this->rules(true)));

        return $ticket->fresh();
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return response()->noContent();
    }
}
