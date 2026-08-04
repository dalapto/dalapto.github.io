import {
	CLIPBOARD_ROW_ID,
	type ClipboardRow,
	type TabId,
} from '../utils/clipboard-helpers';
import { supabase } from '../supabase/supabase-utils';

export async function saveClipboardRow(
	updates: Partial<ClipboardRow> & { last_tab: TabId },
): Promise<ClipboardRow> {
	const { data, error } = await supabase
		.from('clipboard')
		.upsert({ id: CLIPBOARD_ROW_ID, ...updates }, { onConflict: 'id' })
		.select('*')
		.single();

	if (error) throw error;

	return data as ClipboardRow;
}
