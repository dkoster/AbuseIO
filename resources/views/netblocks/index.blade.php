@extends('app')

@section('content')
    <h1 class="page-header">Netblocks</h1>
    <div class="row">
        <div  class="col-md-3 col-md-offset-9 text-right">
            {!! link_to_route('admin.netblocks.create', 'Create Netblock', [], ['class' => 'btn btn-info']) !!}
            {!! link_to_route('admin.export.netblocks', 'CSV Export', ['format' => 'csv'], ['class' => 'btn btn-info']) !!}
        </div>
    </div>
    @if ( !$netblocks->count() )
        <div class="alert alert-info">You have no netblocks yet</div>
    @else
        {!! $netblocks->render() !!}
        <table class="table table-striped table-condensed">
            <thead>
                <tr>
                    <th>Contact</th>
                    <th>First IP</th>
                    <th>Last IP</th>
                    <th class="text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach( $netblocks as $netblock )
                <tr>
                    <td>{{ $netblock->contact->name }} ({{ $netblock->contact->reference }})</td>
                    <td>{{ ICF::inet_itop($netblock->first_ip) }}</td>
                    <td>{{ ICF::inet_itop($netblock->last_ip) }}</td>
                    <td class="text-right">
                        {!! Form::open(['class' => 'form-inline', 'method' => 'DELETE', 'route' => ['admin.netblocks.destroy', $netblock->id]]) !!}
                        {!! link_to_route('admin.netblocks.show', 'Details', [$netblock->id], ['class' => 'btn btn-info btn-xs']) !!}
                        {!! link_to_route('admin.netblocks.edit', 'Edit', [$netblock->id], ['class' => 'btn btn-info btn-xs']) !!}
                        {!! Form::submit('Delete', ['class' => 'btn btn-danger btn-xs']) !!}
                        {!! Form::close() !!}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection
