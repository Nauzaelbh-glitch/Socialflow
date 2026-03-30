$env:STITCH_API_KEY="AQ.Ab8RN6KWJEMHprg9yDuY3o2VNoiAuHLq81U3At-pXf4_e4Fkdw"
$json = '{"deviceType":"DESKTOP","prompt":"Design a modern SaaS dashboard overview page for SocialFlow. Include header with logo and user avatar, sidebar navigation with Dashboard, Empresas, Cuentas Sociales, Publicaciones, Calendario, Analytics. Main area with 4 metric cards, activity feed, and social platform status cards. Use emerald green primary color.","projectId":"18038674816780059065"}'
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
$jsonB64 = [Convert]::ToBase64String($bytes)
npx -y @_davideast/stitch-mcp tool generate_screen_from_text -d $jsonB64
