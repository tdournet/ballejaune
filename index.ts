const BJDEVICE = process.env.BJDEVICE ?? '';
const BJID = process.env.BJID ?? '';
const BOOKING_TIME = process.env.BOOKING_TIME ?? '19:00';

interface ReservationParams {
  date: string; // Format: YYYY-MM-DD (e.g., "2026-01-22")
  timeStart: string; // Format: HH:MM (e.g., "18:00")
  duration: number; // Duration in minutes (e.g., 60)
  schedule?: number; // Schedule ID (default: 32101)
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function getDayOfWeek(dateString: string): number {
  // Returns day of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // But the API seems to use a different format, let's extract the day number
  const date = new Date(dateString);
  return date.getDay();
}

function getNextThursday(): string {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const thursday = 4; // Thursday = 4
  
  // Calculate days until next Thursday
  let daysUntilThursday = thursday - currentDay;
  
  // If today is Thursday or we've passed Thursday this week, get next week's Thursday
  if (daysUntilThursday <= 0) {
    daysUntilThursday += 7;
  }
  
  const nextThursday = new Date(today);
  nextThursday.setDate(today.getDate() + daysUntilThursday);
  
  // Format as YYYY-MM-DD
  return nextThursday.toISOString().split('T')[0];
}

async function makeReservationRequests(params: ReservationParams) {
  const { date, timeStart, duration, schedule = 32101 } = params;
  
  console.log('Reservation parameters:', {
    date,
    timeStart,
    duration,
    schedule
  });
  
  // Calculate derived values
  const timeStartMinutes = timeToMinutes(timeStart);
  const timeEndMinutes = timeStartMinutes + duration;
  const timeEnd = minutesToTime(timeEndMinutes);
  const dayOfWeek = getDayOfWeek(date);
  
  // First request - HEAD request to get BJSESSIONID
  console.log('\nMaking first request to get BJSESSIONID...');
  
  const firstRequestCookies = `bjlanguage=fr_FR; _ga=GA1.1.647834952.1768729125; bjcconsent=dismiss; bjid=${BJID}; bjnotifysuggest=deny; bjdevice=${BJDEVICE}; _ga_MFSD70PBPQ=GS2.1.s1768729124$o1$g1$t1768729215$j59$l0$h0`;
  
  const firstResponse = await fetch('https://ballejaune.com/reservation/', {
    method: 'HEAD',
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7',
      'cache-control': 'no-cache',
      'cookie': firstRequestCookies,
      'pragma': 'no-cache',
      'priority': 'u=0, i',
      'referer': 'https://ballejaune.com/club/tcgenas',
      'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'
    }
  });

  // Extract BJSESSIONID from Set-Cookie header
  const setCookieHeader = firstResponse.headers.get('set-cookie');
  console.log('Set-Cookie header:', setCookieHeader);
  
  let bjSessionId = '';
  if (setCookieHeader) {
    const cookies = setCookieHeader.split(',').map((c: string) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith('BJSESSIONID=')) {
        bjSessionId = cookie.split(';')[0].split('=')[1];
        break;
      }
    }
  }
  
  if (!bjSessionId) {
    console.error('Failed to extract BJSESSIONID from response');
    return;
  }
  
  console.log('BJSESSIONID:', bjSessionId);

  // Second request - POST to /reservation/switch to get CSRF token
  console.log('\nMaking second request to get CSRF token...');
  
  const switchRequestCookies = `bjlanguage=fr_FR; _ga=GA1.1.647834952.1768729125; bjcconsent=dismiss; bjid=${BJID}; bjnotifysuggest=deny; BJSESSIONID=${bjSessionId}; bjdevice=${BJDEVICE}; _ga_MFSD70PBPQ=GS2.1.s1768729124$o1$g1$t1768730089$j53$l0$h0`;
  
  const switchResponse = await fetch('https://ballejaune.com/reservation/switch', {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'cookie': switchRequestCookies,
      'origin': 'https://ballejaune.com',
      'pragma': 'no-cache',
      'priority': 'u=1, i',
      'referer': 'https://ballejaune.com/reservation/',
      'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest'
    },
    body: `date=${dayOfWeek}&schedule=${schedule}&timestart=${timeStartMinutes}&duration=${duration}`
  });

  const htmlResponse = await switchResponse.text();
  console.log('Switch response received, extracting CSRF token...');
  
  // Extract csrf_reservation token from HTML
  const csrfMatch = htmlResponse.match(/name="csrf_reservation"\s+value="([^"]+)"/);
  if (!csrfMatch || !csrfMatch[1]) {
    console.error('Failed to extract csrf_reservation token from HTML response');
    console.log('HTML snippet:', htmlResponse.substring(0, 500));
    return;
  }
  
  const csrfToken = csrfMatch[1];
  console.log('CSRF token:', csrfToken);

  // Third request - POST to /reservation/process with BJSESSIONID and CSRF token
  console.log('\nMaking third request to process reservation...');
  
  // Combine original cookies with BJSESSIONID
  const thirdRequestCookies = `bjlanguage=fr_FR; _ga=GA1.1.1760199893.1763891003; bjcconsent=dismiss; BJSESSIONID=${bjSessionId}; bjid=${BJID}; bjdevice=${BJDEVICE}; _ga_MFSD70PBPQ=GS2.1.s1768728579$o14$g1$t1768728618$j21$l0$h0`;
  
  // Build post data with the extracted CSRF token
  const postData = `action_type=create&choice=with_member&with_member%5B%5D=2064512&with_member_guests_number=1&with_member_guests_names=&with_guest_guests_number=1&with_guest_name1=&with_guest_name2=&with_guest_name3=&with_guest_name4=&default_date=${date}&default_timestart=${encodeURIComponent(timeStart)}&default_timeend=${encodeURIComponent(timeEnd)}&default_duration=${duration}&default_schedule=${schedule}&default_row=0&poll_request_id=0&csrf_reservation=${csrfToken}`;
  
  const thirdResponse = await fetch('https://ballejaune.com/reservation/process', {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'cookie': thirdRequestCookies,
      'origin': 'https://ballejaune.com',
      'pragma': 'no-cache',
      'priority': 'u=1, i',
      'referer': 'https://ballejaune.com/reservation/week',
      'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest'
    },
    body: postData
  });

  console.log('Third response status:', thirdResponse.status);
  const responseText = await thirdResponse.text();
  console.log('Third response body:', responseText);
  
  return {
    bjSessionId,
    csrfToken,
    status: thirdResponse.status,
    response: responseText
  };
}

const reservationParams: ReservationParams = {
  date: getNextThursday(),
  timeStart: BOOKING_TIME,
  duration: 60,
  schedule: 32101
};

console.log(`Booking for: ${reservationParams.date} at ${reservationParams.timeStart}`);

// Run the requests
makeReservationRequests(reservationParams)
  .then(result => {
    console.log('\n=== Request completed successfully ===');
    console.log('Result:', result);
  })
  .catch(error => {
    console.error('Error making requests:', error);
  });
