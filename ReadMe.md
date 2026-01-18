I want to make a typescript code that makes two requests to a website. 
The first one is represented by this curl call. It must be made as is with all the cookies.

curl -I 'https://ballejaune.com/reservation/' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7' \
  -H 'cache-control: no-cache' \
  -b 'bjlanguage=fr_FR; _ga=GA1.1.647834952.1768729125; bjcconsent=dismiss; bjid=VHZvZzJteHZPQzlSeVpjMTdMSjROcFRoSkdIMkFIZmYwM3lzQWU1RDR3aE1zWWZMUy94dGdSNENpemtuUGsvU00xVE8rUk5GcTJJSG5KTnU2Y05naXJ2ZFIzK3lZLytaRTFkK3hyWTFId2J5cHJ0R3hEeFU4aFgrZFZweUZXcTY6OuXNdVvSVJvydwsl%2Fdql9ME%3D; bjnotifysuggest=deny; bjdevice=R1Z0SnlGMjU2VU1scGM4YXgyRmRrVmttSndySyt2SnZ4azJVMzhKSVFGRzVjMUFWK2U5VzJacjBhRk9UM1JHL25ob0FETmFKOFhraElYcTYrWHNlRHVoTituOS91Q0xmM2VxelZKS21LV0U9OjrdiK8R7D3JdI2UEvYq7450; _ga_MFSD70PBPQ=GS2.1.s1768729124$o1$g1$t1768729215$j59$l0$h0' \
  -H 'pragma: no-cache' \
  -H 'priority: u=0, i' \
  -H 'referer: https://ballejaune.com/club/tcgenas' \
  -H 'sec-ch-ua: "Not(A:Brand";v="8", "Chromium";v="144"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'

 This call in return sets a cookie named BJSESSIONID. Get it from the response headers and use it in the second call.
 Then, the script has to make a second call represented by this second curl call including the BJSESSIONID. 
  

curl 'https://ballejaune.com/reservation/process' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/x-www-form-urlencoded; charset=UTF-8' \
  -b 'bjlanguage=fr_FR; _ga=GA1.1.1760199893.1763891003; bjcconsent=dismiss; BJSESSIONID=0b2LyvZC3iKgOLA9FkbmeMuW7Hj9mI4hpZVinUvnc43jdPje; bjid=NmtBRzNmRWQvanlFbStBUkc3K3JyYlQ0YkFyZFk3SGU0S1U5UjBYbmUxVEtTZlgySGNkdm5ZaUhIZUlLVUtscTdSc2E3bmYrT056ZUVQd2NoZmtMc2lTNDhXUkdqSzUvdFp1NW8wUWhQaktKSmN6OXBseE9pMGdFRG55ekFwbmw6OkKzyMW8N9X2O07pb%2BfaM3Y%3D; bjdevice=QWw1OGZ3Q0NDZGh6ZnFYVFdvVTJCU3lCZDZJSHNIYndMWld3S1JacUdlUzdRd2ZOaHZtRXJUVjVxcTZnY1JsTFpFNXNjRjJBWGNFbmtmalNvQUVVMlMxaVR6TXZjZ09NcjdSRGNPOTZndFk9OjpCL1N9U2yghXH%2BExuDYRrN; _ga_MFSD70PBPQ=GS2.1.s1768728579$o14$g1$t1768728618$j21$l0$h0' \
  -H 'origin: https://ballejaune.com' \
  -H 'pragma: no-cache' \
  -H 'priority: u=1, i' \
  -H 'referer: https://ballejaune.com/reservation/week' \
  -H 'sec-ch-ua: "Not(A:Brand";v="8", "Chromium";v="144"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36' \
  -H 'x-requested-with: XMLHttpRequest' \
  --data-raw 'action_type=create&choice=with_member&with_member%5B%5D=2064512&with_member_guests_number=1&with_member_guests_names=&with_guest_guests_number=1&with_guest_name1=&with_guest_name2=&with_guest_name3=&with_guest_name4=&default_date=2026-01-22&default_timestart=18%3A00&default_timeend=19%3A00&default_duration=60&default_schedule=32101&default_row=0&poll_request_id=0&csrf_reservation=dfea00ece55ea20d0c14ed8da7cf06702a10d0d9811443e249aac5f1509abc3c'