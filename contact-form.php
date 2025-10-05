<?php
// contact-form.php — Secure form handler returning JSON

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Basic rate-limiting via session (best-effort without external storage)
if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}
if (!empty($_SESSION['last_submit']) && (time() - (int)$_SESSION['last_submit']) < 5) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Please wait a moment before retrying.']);
    exit;
}

// Helper sanitizers
function sanitize_text($value, $max = 5000) {
    $value = trim((string)$value);
    $value = preg_replace("/\r|\n/", ' ', $value); // prevent header injection
    $value = filter_var($value, FILTER_UNSAFE_RAW, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
    if (mb_strlen($value) > $max) {
        $value = mb_substr($value, 0, $max);
    }
    return $value;
}

function sanitize_email_addr($email) {
    $email = trim((string)$email);
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return '';
    }
    return $email;
}

// Collect POST (supports either classic form or fetch FormData)
$name    = isset($_POST['name'])    ? sanitize_text($_POST['name'], 200)      : '';
$email   = isset($_POST['email'])   ? sanitize_email_addr($_POST['email'])    : '';
$phone   = isset($_POST['phone'])   ? sanitize_text($_POST['phone'], 50)      : '';
$message = isset($_POST['message']) ? sanitize_text($_POST['message'], 5000)  : '';
$hp      = isset($_POST['website']) ? trim((string)$_POST['website'])         : '';

// Honeypot: if filled, treat as spam silently succeed
if ($hp !== '') {
    echo json_encode(['success' => true, 'message' => 'Thanks!']);
    exit;
}

// Validate required fields
$errors = [];
if ($name === '' || mb_strlen($name) < 2) {
    $errors[] = 'Please provide a valid name.';
}
if ($email === '') {
    $errors[] = 'Please provide a valid email address.';
}
if ($message === '' || mb_strlen($message) < 10) {
    $errors[] = 'Message should be at least 10 characters.';
}

if (!empty($phone)) {
    // allow +, digits, spaces, dashes, parentheses, min 7 digits total
    $digits = preg_replace('/\D+/', '', $phone);
    if (strlen($digits) < 7) {
        $errors[] = 'Please provide a valid phone number.';
    }
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// Email configuration
$to = 'ENG_ATB@YAHOO.COM'; // Default recipient (from site contact section)
$subject = 'New Contact Form Submission';

// Build message
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$body = "You have a new contact form submission:\n\n" .
        "Name: {$name}\n" .
        "Email: {$email}\n" .
        "Phone: {$phone}\n\n" .
        "Message:\n{$message}\n\n" .
        "IP: {$ip}\n" .
        "User-Agent: {$ua}\n" .
        "Time: " . date('c') . "\n";

// Headers: use fixed From and Reply-To user email
$siteDomain = $_SERVER['SERVER_NAME'] ?? 'example.com';
$from = 'no-reply@' . preg_replace('/[^a-zA-Z0-9.-]+/', '', $siteDomain);
$headers = [];
$headers[] = 'From: Website <' . $from . '>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    $_SESSION['last_submit'] = time();
    echo json_encode(['success' => true, 'message' => 'Thanks! Your message has been sent.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send. Please try again later.']);
}
