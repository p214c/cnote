#include "../../main/include/crypt.h"

using namespace crypto;

int main() {
	std::cout << "Starting" << std::endl;

	std::string ENCRYPT_PREFIX = "encrypted||||";
	int ENCRYPT_PREFIX_LEN = ENCRYPT_PREFIX.size();

	std::string messages[] = { "encrypt this!", "3||||test", "", ENCRYPT_PREFIX
			+ "1||||\ttab\nnewline" };

	for (int idx = 0, len = sizeof(messages) / sizeof(std::string); idx < len;
			idx++) {
		crypto::Crypt* cipher = new crypto::Crypt();
		if (cipher == NULL) {
			std::cout << "ERROR: failed to instantiate cipher!" << std::endl;
			continue;
		}

		std::string message = messages[idx];
		if (message.empty()) {
			std::cout << "INFO: detected empty message." << std::endl;
			continue;
		}

		std::cout << "Before encrypt: " + message << std::endl;

		message = ENCRYPT_PREFIX + cipher->encrypt(message);
		std::cout << "Encrypted: " + message << std::endl;

		int prefixPos = message.find_first_of(ENCRYPT_PREFIX);
		if (prefixPos == 0) {
			std::cout << "Before decrypt: " + message << std::endl;
			int prefixLen = message.find_first_of(ENCRYPT_PREFIX)
					+ ENCRYPT_PREFIX_LEN;
			message = cipher->decrypt(message.substr(prefixLen));
			std::cout << "Decrypted: " + message << std::endl;
		} else {
			std::cout << "Didn't detect encryption: " + message << std::endl;
		}

		if (cipher) {
			std::cout << "destroying cipher" << std::endl;
			delete cipher;
			cipher = NULL;
		}

		std::cout << "Next" << std::endl << std::endl;
	}

	return 0;
}

