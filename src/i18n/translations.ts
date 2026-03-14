export type Lang = 'en' | 'ko' | 'de';

const translations: Record<string, Record<Lang, string>> = {
  // Splash
  'splash.start': { en: 'Get Started', ko: '시작하기', de: 'Starten' },
  'splash.have_code': { en: 'I have a pairing code', ko: '코드가 있어요', de: 'Ich habe einen Code' },
  'splash.enter_code': { en: "Enter your partner's code", ko: '파트너 코드 입력', de: 'Code eingeben' },
  'splash.code_not_found': { en: 'Code not found. Check with your partner.', ko: '코드를 찾을 수 없어요.', de: 'Code nicht gefunden.' },
  'splash.tagline': { en: 'Our private space', ko: '우리 둘만의 공간', de: 'Unser privater Raum' },
  'splash.back': { en: 'Back', ko: '뒤로', de: 'Zurück' },

  // Onboarding
  'onboarding.profile_title': { en: 'About You', ko: '프로필 설정', de: 'Über dich' },
  'onboarding.name': { en: 'Your name', ko: '이름', de: 'Dein Name' },
  'onboarding.name_placeholder': { en: 'Enter your name', ko: '이름을 입력하세요', de: 'Name eingeben' },
  'onboarding.gender': { en: 'Gender', ko: '성별', de: 'Geschlecht' },
  'onboarding.male': { en: 'Male', ko: '남성', de: 'Männlich' },
  'onboarding.female': { en: 'Female', ko: '여성', de: 'Weiblich' },
  'onboarding.other': { en: 'Other', ko: '기타', de: 'Andere' },
  'onboarding.birthday': { en: 'Date of birth', ko: '생년월일', de: 'Geburtsdatum' },
  'onboarding.color': { en: 'Profile color', ko: '프로필 색상', de: 'Profilfarbe' },
  'onboarding.next': { en: 'Next', ko: '다음', de: 'Weiter' },
  'onboarding.skip': { en: 'Skip for now', ko: '건너뛰기', de: 'Überspringen' },
  'onboarding.anniversary': { en: 'When did you start dating?', ko: '사귀기 시작한 날은?', de: 'Seit wann seid ihr zusammen?' },
  'onboarding.anniversary_skip': { en: 'Skip', ko: '건너뛰기', de: 'Überspringen' },
  'onboarding.done': { en: 'Done', ko: '완료', de: 'Fertig' },
  'onboarding.photo': { en: 'Profile Photo', ko: '프로필 사진', de: 'Profilfoto' },
  'onboarding.photo_add': { en: 'Add photo', ko: '사진 추가', de: 'Foto hinzufügen' },

  // Pairing
  'pairing.title': { en: 'Share with your partner', ko: '파트너에게 공유하세요', de: 'Teile mit deinem Partner' },
  'pairing.subtitle': { en: 'They can enter this code to connect', ko: '이 코드로 연결할 수 있어요', de: 'Dein Partner kann diesen Code eingeben' },
  'pairing.copy': { en: 'Copy code', ko: '코드 복사', de: 'Code kopieren' },
  'pairing.copied': { en: 'Copied!', ko: '복사됨!', de: 'Kopiert!' },
  'pairing.continue': { en: 'Continue to app', ko: '앱으로 이동', de: 'Weiter zur App' },

  // Navigation
  'nav.home': { en: 'Home', ko: '홈', de: 'Start' },
  'nav.calendar': { en: 'Calendar', ko: '캘린더', de: 'Kalender' },
  'nav.dates': { en: 'Dates', ko: '기념일', de: 'Termine' },
  'nav.chat': { en: 'Chat', ko: '채팅', de: 'Chat' },
  'nav.more': { en: 'More', ko: '더보기', de: 'Mehr' },

  // Home
  'home.today': { en: 'Today', ko: '오늘', de: 'Heute' },
  'home.upcoming': { en: 'Upcoming', ko: '다가오는 일정', de: 'Anstehend' },
  'home.no_events': { en: 'No events today', ko: '오늘 일정이 없어요', de: 'Keine Termine heute' },
  'home.dday': { en: 'D-Day', ko: 'D-Day', de: 'D-Day' },
  'home.together': { en: 'Together', ko: '함께한 지', de: 'Zusammen seit' },
  'home.days': { en: 'days', ko: '일', de: 'Tagen' },

  // Calendar
  'calendar.month': { en: 'Month', ko: '월', de: 'Monat' },
  'calendar.week': { en: 'Week', ko: '주', de: 'Woche' },
  'calendar.today': { en: 'Today', ko: '오늘', de: 'Heute' },
  'calendar.new_event': { en: 'New Event', ko: '새 일정', de: 'Neuer Termin' },

  // Events
  'event.title': { en: 'Title', ko: '제목', de: 'Titel' },
  'event.title_placeholder': { en: 'Event title', ko: '일정 제목', de: 'Terminname' },
  'event.start': { en: 'Start', ko: '시작', de: 'Start' },
  'event.end': { en: 'End', ko: '종료', de: 'Ende' },
  'event.all_day': { en: 'All day', ko: '하루 종일', de: 'Ganztägig' },
  'event.who': { en: 'Who', ko: '누구', de: 'Wer' },
  'event.me': { en: 'Me', ko: '나', de: 'Ich' },
  'event.partner': { en: 'Partner', ko: '파트너', de: 'Partner' },
  'event.both': { en: 'Both', ko: '함께', de: 'Beide' },
  'event.category': { en: 'Category', ko: '카테고리', de: 'Kategorie' },
  'event.location': { en: 'Location', ko: '장소', de: 'Ort' },
  'event.save': { en: 'Save', ko: '저장', de: 'Speichern' },
  'event.delete': { en: 'Delete', ko: '삭제', de: 'Löschen' },
  'event.edit': { en: 'Edit', ko: '수정', de: 'Bearbeiten' },

  // Todos
  'todo.title': { en: 'To-do', ko: '할 일', de: 'Aufgaben' },
  'todo.add': { en: 'Add to-do', ko: '할 일 추가', de: 'Aufgabe hinzufügen' },
  'todo.placeholder': { en: 'What needs to be done?', ko: '무엇을 해야 하나요?', de: 'Was muss erledigt werden?' },
  'todo.completed': { en: 'Completed', ko: '완료됨', de: 'Erledigt' },
  'todo.active': { en: 'Active', ko: '진행 중', de: 'Aktiv' },

  // Dates / Key Dates
  'dates.title': { en: 'Key Dates', ko: '기념일', de: 'Termine' },
  'dates.add': { en: 'Add date', ko: '기념일 추가', de: 'Termin hinzufügen' },
  'dates.anniversary': { en: 'Anniversary', ko: '기념일', de: 'Jubiläum' },
  'dates.birthday': { en: 'Birthday', ko: '생일', de: 'Geburtstag' },
  'dates.custom': { en: 'Custom', ko: '커스텀', de: 'Benutzerdefiniert' },
  'dates.ddays_left': { en: 'days left', ko: '일 남음', de: 'Tage übrig' },
  'dates.ddays_ago': { en: 'days ago', ko: '일 전', de: 'Tage her' },
  'dates.today_is': { en: "It's today!", ko: '오늘이에요!', de: 'Heute ist es soweit!' },

  // Chat
  'chat.placeholder': { en: 'Type a message...', ko: '메시지를 입력하세요...', de: 'Nachricht eingeben...' },
  'chat.send': { en: 'Send', ko: '보내기', de: 'Senden' },

  // Notes
  'notes.title': { en: 'Notes', ko: '노트', de: 'Notizen' },
  'notes.add': { en: 'New note', ko: '새 노트', de: 'Neue Notiz' },
  'notes.placeholder': { en: 'Start writing...', ko: '작성을 시작하세요...', de: 'Schreibe etwas...' },

  // More
  'more.title': { en: 'More', ko: '더보기', de: 'Mehr' },
  'more.profile': { en: 'My Profile', ko: '내 프로필', de: 'Mein Profil' },
  'more.theme': { en: 'Theme', ko: '테마', de: 'Design' },
  'more.language': { en: 'Language', ko: '언어', de: 'Sprache' },
  'more.categories': { en: 'Categories', ko: '카테고리', de: 'Kategorien' },
  'more.holidays': { en: 'Holidays', ko: '공휴일', de: 'Feiertage' },
  'more.notes': { en: 'Notes', ko: '노트', de: 'Notizen' },
  'more.lists': { en: 'Lists', ko: '리스트', de: 'Listen' },
  'more.bucket_list': { en: 'Bucket List', ko: '버킷리스트', de: 'Bucket List' },
  'more.pairing_code': { en: 'Pairing Code', ko: '페어링 코드', de: 'Kopplungscode' },
  'more.kr_holidays': { en: 'Korean Holidays', ko: '한국 공휴일', de: 'Koreanische Feiertage' },
  'more.de_holidays': { en: 'German Holidays', ko: '독일 공휴일', de: 'Deutsche Feiertage' },

  // Months
  'month.1': { en: 'January', ko: '1월', de: 'Januar' },
  'month.2': { en: 'February', ko: '2월', de: 'Februar' },
  'month.3': { en: 'March', ko: '3월', de: 'März' },
  'month.4': { en: 'April', ko: '4월', de: 'April' },
  'month.5': { en: 'May', ko: '5월', de: 'Mai' },
  'month.6': { en: 'June', ko: '6월', de: 'Juni' },
  'month.7': { en: 'July', ko: '7월', de: 'Juli' },
  'month.8': { en: 'August', ko: '8월', de: 'August' },
  'month.9': { en: 'September', ko: '9월', de: 'September' },
  'month.10': { en: 'October', ko: '10월', de: 'Oktober' },
  'month.11': { en: 'November', ko: '11월', de: 'November' },
  'month.12': { en: 'December', ko: '12월', de: 'Dezember' },

  // Days
  'day.mon': { en: 'Mon', ko: '월', de: 'Mo' },
  'day.tue': { en: 'Tue', ko: '화', de: 'Di' },
  'day.wed': { en: 'Wed', ko: '수', de: 'Mi' },
  'day.thu': { en: 'Thu', ko: '목', de: 'Do' },
  'day.fri': { en: 'Fri', ko: '금', de: 'Fr' },
  'day.sat': { en: 'Sat', ko: '토', de: 'Sa' },
  'day.sun': { en: 'Sun', ko: '일', de: 'So' },

  // Common
  'common.save': { en: 'Save', ko: '저장', de: 'Speichern' },
  'common.cancel': { en: 'Cancel', ko: '취소', de: 'Abbrechen' },
  'common.delete': { en: 'Delete', ko: '삭제', de: 'Löschen' },
  'common.edit': { en: 'Edit', ko: '수정', de: 'Bearbeiten' },
  'common.close': { en: 'Close', ko: '닫기', de: 'Schließen' },
  'common.confirm': { en: 'Confirm', ko: '확인', de: 'Bestätigen' },
  'common.loading': { en: 'Loading...', ko: '로딩 중...', de: 'Laden...' },

  // Profile
  'profile.photo': { en: 'Profile Photo', ko: '프로필 사진', de: 'Profilfoto' },
  'profile.photo.add': { en: 'Add photo', ko: '사진 추가', de: 'Foto hinzufügen' },
  'profile.photo.change': { en: 'Change photo', ko: '사진 변경', de: 'Foto ändern' },
  'profile.pairing_code': { en: 'Pairing Code', ko: '페어링 코드', de: 'Kopplungscode' },
  'profile.show_code': { en: 'Show code', ko: '코드 보기', de: 'Code anzeigen' },
};

export default translations;
