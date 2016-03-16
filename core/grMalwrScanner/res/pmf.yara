
/*
    Detect:
        - phpencode.org
        - http://www.pipsomania.com/best_php_obfuscator.do
        - http://atomiku.com/online-php-code-obfuscator/
        - http://www.webtoolsvn.com/en-decode/
        - http://obfuscator.uk/example/
        - http://w3webtools.com/encode-php-online/
        - http://www.joeswebtools.com/security/php-obfuscator/
        - https://github.com/epinna/weevely3
        - http://cipherdesign.co.uk/service/php-obfuscator
        - http://sysadmin.cyklodev.com/online-php-obfuscator/
        - http://mohssen.org/SpinObf.php
        - https://code.google.com/p/carbylamine/
*/

global private rule IsPhp
{
    strings:
        $php = /<\?[^x]/

    condition:
        $php and filesize < 5MB
}

private rule IRC
{
    strings:
        $ = "USER" fullword
        $ = "PASS" fullword
        $ = "PRIVMSG" fullword
        $ = "MODE" fullword
        $ = "PING" fullword
        $ = "PONG" fullword
        $ = "JOIN" fullword
        $ = "PART" fullword

    condition:
        5 of them
}

private rule CloudFlareBypass
{
    strings:
        $ = "chk_jschl"
        $ = "jschl_vc"
        $ = "jschl_answer"

    condition:
        2 of them // Better be safe than sorry
}

rule PMF_ObfuscatedPhp
{
    strings:
        $eval = /[;}][\t ]*@?(eval|preg_replace|system|exec)\(/  // ;eval( <- this is dodgy
        $align = /(\$\w+=[^;]*)*;\$\w+=@?\$\w+\(/  //b374k
        $oneliner = /<\?php\s*\n*\r*\s*(eval|preg_replace|system|exec)\(/
        $weevely3 = /\$\w=\$[a-zA-Z]\('',\$\w\);\$\w\(\);/  // weevely3 launcher
        $c99_launcher = /;\$\w+\(\$\w+(,\s?\$\w+)+\);/  // http://bartblaze.blogspot.fr/2015/03/c99shell-not-dead.html
        $danone = /\$s20=strtoupper\((\$[0-9A-Za-z]{1,4}\[\d+\]\.){2,9}[^\)]*\);if/
        $strange_arg = /\${\$[0-9a-zA-z]+}/
    condition:
        any of them
}

private rule base64
{
    strings:
        $eval = "ZXZhbCg"
        $system = "c3lzdGVt"
        $preg_replace = "cHJlZ19yZXBsYWNl"
        $exec = "ZXhlYyg"
    condition:
        any of them
}

private rule hex
{
    strings:
      $eval = "\\x65\\x76\\x61\\x6C\\x28" nocase
      $exec = "\\x65\\x78\\x65\\x63" nocase
      $system = "\\x73\\x79\\x73\\x74\\x65\\x6d" nocase
      $preg_replace = "\\x70\\x72\\x65\\x67\\x5f\\x72\\x65\\x70\\x6c\\x61\\x63\\x65" nocase
    
    condition:
        any of them
}

rule PMF_SuspiciousEncoding
{
    condition:
        base64 or hex
}

rule PMF_DodgyPhp
{
    strings:
        $vars = /\$___+/ // $__ is rarely used in legitimate scripts
        $execution = /(eval|assert|passthru|exec|system|win_shell_execute) *\((base64_decode|php:\/\/input|str_rot13|gz(inflate|uncompress)|getenv|\\?\$_(GET|REQUEST|POST))/
        $double_encoding = /(base64_decode\s*\(\s*){2}/
        $basedir_bypass = /(curl_init\([\"']file:[\"']|file:file:\/\/)/
        $safemode_bypass = /\x00\/\.\.\/|LD_PRELOAD/
        $shellshock = /putenv\(["']PHP_[^=]=\(\) { [^}] };/
        $restore_bypass = /ini_restore\(['"](safe_mode|open_basedir)['"]\)/
        $various = "<!--#exec cmd="  //http://www.w3.org/Jigsaw/Doc/User/SSI.html#exec
        $pr = /preg_replace\s*\(['"]\/[^\/]*\/e['"]/  // http://php.net/manual/en/function.preg-replace.php
        $include = /include\([^\.]+\.(png|jpg|gif|bmp)/  // Clever includes
        $htaccess = "SetHandler application/x-httpd-php"
        $udp_dos = /sockopen\s*\(['"]udp:\/\//

    condition:
        (any of them or CloudFlareBypass)
}

rule PMF_DangerousPhp
{
    strings:
        $system = "system" fullword  // localroot bruteforcers have a lot of this

        $ = "exec" fullword
        $ = "eval" fullword
        $ = "shell_exec" fullword
        $ = "passthru" fullword
        $ = "posix_getuid" fullword
        $ = "posix_geteuid" fullword
        $ = "posix_getgid" fullword
        $ = "phpinfo" fullword
        $ = "backticks" fullword
        $ = "proc_open" fullword
        $ = "win_shell_execute" fullword
        $ = "win32_create_service" fullword
        $ = "posix_getpwuid" fullword
        $ = "shm_open" fullword
        $ = "assert" fullword
        $ = "fsockopen" fullword
        $ = "function_exists" fullword
        $ = "getmygid" fullword
        $ = "php_uname" fullword
        $ = "socket_create(AF_INET, SOCK_STREAM, SOL_TCP)"
        $ = "fpassthru" fullword
        $ = "posix_setuid" fullword
        $ = "xmlrpc_decode" fullword
        $ = "show_source" fullword
        $ = "pcntl_exec" fullword
        $ = "array_filter" fullword

        $whitelist = /escapeshellcmd|escapeshellarg/

    condition:
        not $whitelist and (5 of them or #system > 250)
}

rule PMF_DodgyStrings
{
    strings:
        $ = "/etc/passwd"
        $ = "/etc/shadow"
        $ = "/etc/resolv.conf"
        $ = "/etc/syslog.conf"
        $ = "/etc/proftpd.conf"
        $ = "WinExec"
        $ = "uname -a" fullword
        $ = "nc -l" fullword
        $ = "ls -la" fullword
        $ = "cmd.exe" fullword nocase
        $ = "ipconfig" fullword nocase
        $ = "find . -type f" fullword
        $ = "defaced" fullword nocase
        $ = "slowloris" fullword nocase
        $ = "id_rsa" fullword
        $ = "backdoor" fullword nocase
        $ = "webshell" fullword nocase
        $ = "exploit" fullword nocase
        $ = "hacking" fullword nocase
        $ = "/proc/cpuinfo" fullword
        $ = "/bin/sh" fullword
        $ = "/bin/bash" fullword
        $ = "ps -aux" fullword
        $ = "b374k" fullword
        $ = /(reverse|web)\s*shell/ nocase

        $vbs = /language\s*=\s*vbscript/ nocase
        $asp = "scripting.filesystemobject" nocase

    condition:
        IRC or 2 of them
}

rule PMF_Websites
{
    strings:
        $ = "milw0rm.com"
        $ = "exploit-db.com"
        $ = "1337day.com"
        $ = "rapid7.com"
        $ = "shodan.io"
        $ = "packetstormsecurity"
        $ = "crackfor" nocase
        $ = "md5.rednoize"
        $ = "hashcracking" nocase
        $ = "darkc0de" nocase
        $ = "securityfocus" nocase
        $ = "antichat.ru"
        $ = "KingDefacer" nocase
        $ = "md5crack.com"
        $ = "md5decrypter.com"
        $ = "hashkiller.com"
        $ = "hashchecker.com"
        $ = "www.fopo.com.ar"  /* Free Online Php Obfuscator */
        $ = "ccteam.ru"
        $ = "locus7s.com"

    condition:
        any of them
}
