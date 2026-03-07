-- Just update the project status without the insert
UPDATE projects SET 
  current_status = '✅ Task Updates timeline implementado. 14 entries históricos. Frontend con timeline cronológico por task.',
  updated_at = NOW()
WHERE id = '31111111-1111-1111-1111-111111111111';
