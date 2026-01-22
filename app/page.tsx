import FeedManager from './components/FeedManager';
import { RSWEntry } from './types';
import { getAllNotionEntries } from './lib/notion';
import { DEFAULT_FIELD_MAPPING } from './lib/notion-config';

// Fetch all entries from Notion
async function getAllEntries(): Promise<RSWEntry[]> {
  try {
    // Use the default field mapping
    const entries = await getAllNotionEntries();

    // If you need custom field mapping, use this instead:
    // const entries = await getAllNotionEntriesWithMapping(DEFAULT_FIELD_MAPPING);

    return entries;
  } catch (error) {
    console.error('Error fetching entries from Notion:', error);
    return [];
  }
}

export default async function Home() {
  const entries = await getAllEntries();

  return (
    <FeedManager entries={entries} />
  );
}
