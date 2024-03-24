'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

export function Tasks() {
	const tasks = useQuery(api.tasks.get) || [];

	return (
		<li>
			{tasks.map(({ _id, text }) => (
				<ul key={_id}>{text}</ul>
			))}
		</li>
	);
}
