import { permanentRedirect } from 'next/navigation';

export default function LegacyWorkAlias() {
  permanentRedirect('/solutions');
}
