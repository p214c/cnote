#include "../../main/include/crypt.h"

using namespace crypto;
using namespace std;

// Globals
string MSG_SEPARATOR = "||||";
string ENCRYPT_PREFIX = "encrypted" + MSG_SEPARATOR;

string encryptMessage(Crypt* cipher, const string& message) {
	cout << "INFO: encrypting message " + message << endl;

	string::size_type msgIdx = message.find(MSG_SEPARATOR);

	// preserve any leading text before message separator token
	string prefix = "";
	if (msgIdx == string::npos) {
		msgIdx = 0;
	} else {
		prefix = message.substr(0, msgIdx + MSG_SEPARATOR.size());
	}

	string encrypted = prefix + ENCRYPT_PREFIX
			+ cipher->encrypt(message.substr(prefix.size()));
	cout << "INFO: encrypted message " + encrypted << endl;

	return encrypted;
}

string decryptMessage(Crypt* cipher, const string& message) {
	cout << "INFO: decrypting message " + message << endl;

	string::size_type encryptIdx = message.find(ENCRYPT_PREFIX);

	// preserve any leading text before encrypt id token
	string prefix = "";
	if (encryptIdx == string::npos) {
		cout
				<< "INFO: did not detect encrypt prefix attempting to decrypt message"
				<< endl;
		return message;
	} else {
		prefix = message.substr(0, encryptIdx);
	}

	try {
		string decrypted = prefix
				+ cipher->decrypt(
						message.substr(encryptIdx + ENCRYPT_PREFIX.size()));
		cout << "INFO: decrypted message " + decrypted << endl;

		return decrypted;
	} catch (const std::exception& ex) {
		string msg = "ERROR: exception occurred ";
		msg += ex.what();
		cout << msg << endl;
		return message;
	}
}

string processMessage(Crypt* cipher, const string& message) {
	if (message.empty()) {
		cout << "INFO: detected empty message." << endl;
	} else {
		cout << "INFO: processing message " << message << endl;
		string::size_type prefixPos = message.find(ENCRYPT_PREFIX);
		cout << "INFO: detected encrypted prefix at " << prefixPos
				<< " is npos " << (prefixPos == string::npos) << endl;
		if (prefixPos == string::npos) {
			return encryptMessage(cipher, message);
		} else {
			return decryptMessage(cipher, message);
		}
	}

	return "";
}

int main() {
	cout << "Starting" << endl;

	string messages[] = { "encrypt this!", "3||||test", "", ENCRYPT_PREFIX
			+ "1||||\ttab\nnewline" };

	for (int idx = 0, len = sizeof(messages) / sizeof(string); idx < len;
			idx++) {
		crypto::Crypt* cipher = new crypto::Crypt();
		if (cipher == NULL) {
			cout << "ERROR: failed to instantiate cipher!" << endl;
			continue;
		}

		string message = messages[idx];
		if (message.empty()) {
			cout << "INFO: detected empty message." << endl;
			continue;
		}

		cout << "Before encrypting message: " + message << endl;
		message = processMessage(cipher, message);
		cout << "Encrypted message returned: " + message << endl;

		cout << "Before decrypting message: " + message << endl;
		message = processMessage(cipher, message);
		cout << "Decrypted message returned: " + message << endl;

		if (cipher) {
			cout << "destroying cipher" << endl;
			delete cipher;
			cipher = NULL;
		}

		cout << "Next" << endl << endl;
	}

	return 0;
}
