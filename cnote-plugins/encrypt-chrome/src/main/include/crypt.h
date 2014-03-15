// Copyright (c) 2014 The cnote Authors. All rights reserved.

#ifndef CRYPT_CPP_MODULE_H_
#define CRYPT_CPP_MODULE_H_

#include <iostream>
#include <iomanip>

#include "modes.h"
#include "aes.h"
#include "filters.h"

namespace crypto {

class Crypt {
private:
	byte key[CryptoPP::AES::DEFAULT_KEYLENGTH];
	byte iv[CryptoPP::AES::BLOCKSIZE];

public:

	Crypt() {
		//
		// Key and IV setup
		//AES encryption uses a secret key of a variable length (128-bit, 196-bit or 256-
		//bit). This key is secretly exchanged between two parties before communication
		//begins. DEFAULT_KEYLENGTH= 16 bytes
		memset(key, 0x00, CryptoPP::AES::DEFAULT_KEYLENGTH);
		memset(iv, 0x00, CryptoPP::AES::BLOCKSIZE);
	}

	virtual ~Crypt() {
	}

	// encrypt() returns the encrypted value for the supplied string
	//
	// @return The encrypted value
	std::string encrypt(std::string encipher);

	// decrypt() returns the decrypted value for the supplied cipher text
	//
	// @return The decrypted value
	std::string decrypt(std::string decipher);

	int main() {
		std::cout << "Starting";

		crypto::Crypt* cipher = new crypto::Crypt();

		std::string ENCRYPT_PREFIX = "encrypted||||";

		std::string message = "encrypt this!";
		std::cout << "Before encrypt: " + message;
		message = "encrypted||||" + cipher->encrypt(message);
		std::cout << "Encrypted: " + message;

		if (message.find(ENCRYPT_PREFIX) > 0) {
			std::cout << "Before decrypt: " + message;
			message = cipher->decrypt(
					message.substr(
							message.find(ENCRYPT_PREFIX)
									+ ENCRYPT_PREFIX.size()));
			std::cout << "Decrypted: " + message;
		} else {
			std::cout << "Didn't detect encryption: " + message;
			return 1;
		}

		std::cout << "Exiting";

		return 0;
	}

};
}  // namespace crypt

#endif  // CRYPT_CPP_MODULE_H_
